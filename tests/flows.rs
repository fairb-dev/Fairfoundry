// tests/flows.rs (updated with serials + attestation + reinspection)
#![cfg(test)]

use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    Address, BytesN, Env, Map, String, Symbol, Vec,
};

use fairfoundry::{
    Fairfoundry, AssetKind, PaymentAsset, Pricing, DiscountTier, ERS, OracleConfig, Roles,
    LotStatus,
};

fn addr(env: &Env) -> Address { Address::generate(env) }

fn setup_env() -> Env {
    let env = Env::default();
    let mut li = LedgerInfo::default();
    li.timestamp = 1_700_000_000;
    env.ledger().set(li);
    env
}

fn payment_asset() -> PaymentAsset {
    PaymentAsset { kind: AssetKind::NativeXlm, decimals: 7 }
}

fn pricing(env: &Env) -> Pricing {
    let mut tiers: Vec<DiscountTier> = Vec::new(env);
    tiers.push_back(DiscountTier { min_qty: 1000, discount_bps: 50 });
    tiers.push_back(DiscountTier { min_qty: 5000, discount_bps: 150 });
    Pricing { price_per_unit: 1_000_000, defect_penalty_bps: 100, tiers }
}

fn ers(env: &Env) -> ERS {
    let mut specs: Map<String,u32> = Map::new(env);
    specs.set(String::from_str(env, "MTF"), 400);
    specs.set(String::from_str(env, "SNR"), 35);
    ERS { version: 1, max_defect_bps: 300, specs }
}

#[test]
fn happy_path_with_attestation_serials_and_reinspection() {
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
        &2u32, // min_escrow_lots
        &None::<OracleConfig>,
        &500_000_000i128, // min_qa_stake
        &100_000_000i128, // oem_bond
        &3600u64,         // dispute window
    );

    // Mint balances
    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &2_000_000_000);

    client.stake_qa(&qa, &600_000_000);
    client.deposit_escrow(&oem, &5_000_000_000);

    let lot_id = String::from_str(&env, "LOT-900");
    client.create_lot(&factory, &lot_id, &2_000u32);

    // QA commits: results, serials, bench attestation
    client.qa_commit(&qa, &lot_id, &BytesN::from_array(&env, &[9u8;32]), &String::from_str(&env, "ipfs://report"));
    client.qa_commit_serials(&qa, &lot_id, &BytesN::from_array(&env, &[8u8;32]), &2_000u32);
    client.qa_commit_attestation(
        &qa, &lot_id,
        &String::from_str(&env, "Bench-A1"),
        &BytesN::from_array(&env, &[7u8;32]),
        &qa
    );
    client.qa_update_counts(&qa, &lot_id, &2_000, &1_960, &40);

    // OEM requests reinspection: sample size 10, due in 1 hour
    let indices = client.request_reinspect(&oem, &lot_id, &10u32, &3600u64, &BytesN::from_array(&env, &[1u8;32]));
    assert!(indices.len() > 0);

    // QA responds to reinspection
    client.qa_reinspect_respond(&qa, &lot_id, &10u32, &0u32);

    // No dispute; execute payment
    let paid = client.execute_payment(&lot_id);
    assert!(paid > 0);
    let lot = client.view_lot(&lot_id);
    assert_eq!(lot.status, LotStatus::Paid);
}

#[test]
fn default_on_reinspection_slashes_qa() {
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
        &1u32,
        &None::<OracleConfig>,
        &200_000_000i128,
        &0i128,
        &1200u64,
    );

    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &3_000_000_000);
    sac.mint(&qa, &1_000_000_000);

    client.stake_qa(&qa, &250_000_000);
    client.deposit_escrow(&oem, &1_500_000_000);

    let lot_id = String::from_str(&env, "LOT-901");
    client.create_lot(&factory, &lot_id, &1_000u32);
    client.qa_commit(&qa, &lot_id, &BytesN::from_array(&env, &[3u8;32]), &String::from_str(&env, "ipfs://r"));
    client.qa_commit_serials(&qa, &lot_id, &BytesN::from_array(&env, &[4u8;32]), &1_000u32);
    client.qa_update_counts(&qa, &lot_id, &1_000, &980, &20);

    // OEM requests reinspection and QA does NOT respond before deadline
    let _ = client.request_reinspect(&oem, &lot_id, &5u32, &600u64, &BytesN::from_array(&env, &[2u8;32]));

    // advance ledger time beyond due
    let mut li = env.ledger().get();
    li.timestamp += 601;
    env.ledger().set(li);

    // caller (factory) slashes QA for default
    client.challenge_default_slash(&factory, &lot_id, &500u32); // 5% of QA stake

    let st = client.view_state();
    assert!(st.qa_stake < 250_000_000);
}
