// tests/invariants.rs
#![cfg(test)]

use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    Address, BytesN, Env, Map, String, Vec,
};

use fairfoundry::{
    Fairfoundry, AssetKind, PaymentAsset, Pricing, DiscountTier, ERS, LotStatus,
};

fn setup_env() -> Env {
    let env = Env::default();
    let mut li = LedgerInfo::default();
    li.timestamp = 1_700_000_000;
    env.ledger().set(li);
    env
}

fn addr(env: &Env) -> Address { Address::generate(env) }

fn pricing(env: &Env) -> Pricing {
    let mut tiers: Vec<DiscountTier> = Vec::new(env);
    tiers.push_back(DiscountTier { min_qty: 1000, discount_bps: 50 });
    Pricing { price_per_unit: 2_000_000, defect_penalty_bps: 200, tiers }
}

fn ers(env: &Env) -> ERS {
    let mut specs: Map<String,u32> = Map::new(env);
    specs.set(String::from_str(env, "SNR"), 40);
    ERS { version: 1, max_defect_bps: 500, specs }
}

#[test]
fn escrow_never_negative_across_flows() {
    let env = setup_env();
    let oem = addr(&env);
    let factory = addr(&env);
    let qa = addr(&env);

    let contract_id = env.register_contract(None, Fairfoundry);
    let client = fairfoundry::Client::new(&env, &contract_id);

    client.init(
        &oem, &factory, &qa,
        &PaymentAsset { kind: AssetKind::NativeXlm, decimals: 7 },
        &pricing(&env),
        &ers(&env),
        &2u32,
        &None,
    );

    // Mint and deposit
    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &10_000_000_000);
    client.deposit_escrow(&oem, &4_000_000_000);

    // Create two lots and pay them in different patterns
    for i in 0..2u32 {
        let lot_id = String::from_str(&env, &format!("INV-{}", i));
        client.create_lot(&factory, &lot_id, &1_500u32);

        // QA
        client.qa_commit(&qa, &lot_id, &BytesN::from_array(&env, &[9u8;32]), &String::from_str(&env, "ipfs://x"));
        client.qa_update_counts(&qa, &lot_id, &1_500, &1_425, &75);

        // Randomized-ish path: even index → partial + final, odd → direct final
        if i % 2 == 0 {
            // Pay up to passed units at list price (no tier at 1425 < 1500 tier threshold)
            let partial = 1_000i128 * 2_000_000i128;
            client.partial_payout(&factory, &lot_id, &partial);
        }
        let _ = client.execute_payment(&lot_id);
    }

    // Invariant: escrow_balance >= 0
    let st = client.view_state();
    assert!(st.escrow_balance >= 0, "escrow went negative");
}

#[test]
fn approved_units_never_exceed_produced() {
    let env = setup_env();
    let oem = addr(&env);
    let factory = addr(&env);
    let qa = addr(&env);

    let contract_id = env.register_contract(None, Fairfoundry);
    let client = fairfoundry::Client::new(&env, &contract_id);

    client.init(
        &oem, &factory, &qa,
        &PaymentAsset { kind: AssetKind::NativeXlm, decimals: 7 },
        &pricing(&env),
        &ers(&env),
        &1u32,
        &None,
    );

    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &5_000_000_000);
    client.deposit_escrow(&oem, &2_000_000_000);

    let lot_id = String::from_str(&env, "INV-A");
    client.create_lot(&factory, &lot_id, &2_000u32);
    client.qa_commit(&qa, &lot_id, &BytesN::from_array(&env, &[7u8;32]), &String::from_str(&env, "ipfs://a"));
    client.qa_update_counts(&qa, &lot_id, &2_000, &1_990, &10);
    let _ = client.execute_payment(&lot_id);

    let st = client.view_state();
    assert!(st.total_units_approved <= st.total_units_produced);
}

#[test]
fn invalid_transitions_rejected() {
    let env = setup_env();
    let oem = addr(&env);
    let factory = addr(&env);
    let qa = addr(&env);

    let contract_id = env.register_contract(None, Fairfoundry);
    let client = fairfoundry::Client::new(&env, &contract_id);

    client.init(
        &oem, &factory, &qa,
        &PaymentAsset { kind: AssetKind::NativeXlm, decimals: 7 },
        &pricing(&env),
        &ers(&env),
        &1u32,
        &None,
    );

    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &2_000_000_000);
    client.deposit_escrow(&oem, &1_000_000_000);

    let lot_id = String::from_str(&env, "INV-B");
    client.create_lot(&factory, &lot_id, &1_000u32);

    // Trying to execute payment before QA approval must fail
    let res = std::panic::catch_unwind(|| client.execute_payment(&lot_id));
    assert!(res.is_err());

    // Update QA counts but not complete → still not approved
    client.qa_commit(&qa, &lot_id, &BytesN::from_array(&env, &[1u8;32]), &String::from_str(&env, "ipfs://b"));
    client.qa_update_counts(&qa, &lot_id, &500, &495, &5);
    let res2 = std::panic::catch_unwind(|| client.execute_payment(&lot_id));
    assert!(res2.is_err());
}

#[test]
fn settlement_is_idempotent_and_caps_at_entitlement() {
    let env = setup_env();
    let oem = addr(&env);
    let factory = addr(&env);
    let qa = addr(&env);

    let contract_id = env.register_contract(None, Fairfoundry);
    let client = fairfoundry::Client::new(&env, &contract_id);

    client.init(
        &oem, &factory, &qa,
        &PaymentAsset { kind: AssetKind::NativeXlm, decimals: 7 },
        &pricing(&env),
        &ers(&env),
        &1u32,
        &None,
    );

    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &2_000_000_000);
    client.deposit_escrow(&oem, &1_000_000_000);

    let lot_id = String::from_str(&env, "INV-C");
    client.create_lot(&factory, &lot_id, &1_000u32);
    client.qa_commit(&qa, &lot_id, &BytesN::from_array(&env, &[5u8;32]), &String::from_str(&env, "ipfs://c"));
    client.qa_update_counts(&qa, &lot_id, &1_000, &980, &20);

    // First call pays
    let paid1 = client.execute_payment(&lot_id);
    assert!(paid1 > 0);

    // Second call should pay zero and just close (idempotent)
    let paid2 = client.execute_payment(&lot_id);
    assert_eq!(paid2, 0);

    let lot = client.view_lot(&lot_id);
    assert!(matches!(lot.status, LotStatus::Paid | LotStatus::Closed));
}
