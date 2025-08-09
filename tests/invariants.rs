// tests/invariants.rs (updated to cover new invariants around serials/challenges)
#![cfg(test)]

use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    Address, BytesN, Env, Map, String, Vec,
};

use fairfoundry::{
    Fairfoundry, AssetKind, PaymentAsset, Pricing, DiscountTier, ERS, LotStatus, OracleConfig,
};

fn setup_env() -> Env {
    let env = Env::default();
    let mut li = LedgerInfo::default();
    li.timestamp = 1_700_000_000;
    env.ledger().set(li);
    env
}

fn addr(env: &Env) -> Address { Address::generate(env) }

fn payment_asset() -> PaymentAsset {
    PaymentAsset { kind: AssetKind::NativeXlm, decimals: 7 }
}

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
fn escrow_and_stake_invariants_hold_with_challenges() {
    let env = setup_env();
    let oem = addr(&env);
    let factory = addr(&env);
    let qa = addr(&env);

    let contract_id = env.register_contract(None, Fairfoundry);
    let client = fairfoundry::Client::new(&env, &contract_id);

    client.init(
        &oem, &factory, &qa,
        &payment_asset(),
        &pricing(&env),
        &ers(&env),
        &2u32,
        &None::<OracleConfig>,
        &100_000_000i128, // min_qa_stake
        &0i128,
        &1800u64,
    );

    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &1_000_000_000);
    client.stake_qa(&qa, &150_000_000);
    client.deposit_escrow(&oem, &4_000_000_000);

    let lot_id = String::from_str(&env, "INV-100");
    client.create_lot(&factory, &lot_id, &1_500u32);
    client.qa_commit(&qa, &lot_id, &BytesN::from_array(&env, &[9u8;32]), &String::from_str(&env, "ipfs://x"));
    client.qa_commit_serials(&qa, &lot_id, &BytesN::from_array(&env, &[6u8;32]), &1_500u32);
    client.qa_update_counts(&qa, &lot_id, &1_500, &1_425, &75);

    // challenge and respond to avoid slash
    let _ = client.request_reinspect(&oem, &lot_id, &7u32, &600u64, &BytesN::from_array(&env, &[5u8;32]));
    client.qa_reinspect_respond(&qa, &lot_id, &7u32, &0u32);

    let _ = client.execute_payment(&lot_id);

    let st = client.view_state();
    assert!(st.escrow_balance >= 0);
    assert!(st.qa_stake >= 100_000_000);
    assert!(st.total_units_approved <= st.total_units_produced);
}
