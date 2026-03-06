use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    token, Address, BytesN, Env, Map, String, Vec,
};

use crate::{
    AssetKind, DiscountTier, Fairfoundry, FairfoundryClient, InitConfig, OracleConfig,
    PaymentAsset, Pricing, ERS,
};

fn setup_env() -> Env {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set(LedgerInfo {
        timestamp: 1_700_000_000,
        protocol_version: 22,
        ..Default::default()
    });
    env
}

fn setup_token(env: &Env) -> (Address, token::StellarAssetClient<'_>) {
    let admin = Address::generate(env);
    let contract = env.register_stellar_asset_contract_v2(admin);
    let address = contract.address();
    let sac = token::StellarAssetClient::new(env, &address);
    (address, sac)
}

fn payment_asset(token_address: &Address) -> PaymentAsset {
    PaymentAsset {
        kind: AssetKind::NativeXlm,
        address: token_address.clone(),
        decimals: 7,
    }
}

fn pricing(env: &Env) -> Pricing {
    let mut tiers: Vec<DiscountTier> = Vec::new(env);
    tiers.push_back(DiscountTier {
        min_qty: 500,
        discount_bps: 50,
    });
    Pricing {
        price_per_unit: 1_000_000,
        defect_penalty_bps: 100,
        tiers,
    }
}

fn ers(env: &Env) -> ERS {
    let specs: Map<String, u32> = Map::new(env);
    ERS {
        version: 1,
        max_defect_bps: 500,
        specs,
    }
}

#[test]
fn escrow_balance_non_negative_after_operations() {
    let env = setup_env();
    let oem = Address::generate(&env);
    let factory = Address::generate(&env);
    let qa = Address::generate(&env);
    let (token_address, sac) = setup_token(&env);

    let contract_id = env.register(Fairfoundry, ());
    let client = FairfoundryClient::new(&env, &contract_id);

    client.init(
        &oem,
        &factory,
        &qa,
        &payment_asset(&token_address),
        &pricing(&env),
        &ers(&env),
        &InitConfig {
            min_escrow_lots: 1u32,
            min_qa_stake: 50_000_000i128,
            oem_bond: 0i128,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &500_000_000);

    client.stake_qa(&qa, &100_000_000);
    client.deposit_escrow(&oem, &3_000_000_000);

    // Create and settle multiple lots
    let p_names = ["P-0", "P-1", "P-2"];
    for i in 0..3u32 {
        let lot_id = String::from_str(&env, p_names[i as usize]);
        client.create_lot(&factory, &lot_id, &200u32);
        client.qa_commit(
            &qa,
            &lot_id,
            &BytesN::from_array(&env, &[i as u8; 32]),
            &String::from_str(&env, "ipfs://x"),
        );
        client.qa_commit_serials(
            &qa,
            &lot_id,
            &BytesN::from_array(&env, &[(i + 10) as u8; 32]),
            &200u32,
        );
        client.qa_update_counts(&qa, &lot_id, &200, &190, &10);
        client.execute_payment(&lot_id);
    }

    let st = client.view_state();
    assert!(st.escrow_balance >= 0, "Escrow must never go negative");
}

#[test]
fn qa_locked_stake_lte_total_stake() {
    let env = setup_env();
    let oem = Address::generate(&env);
    let factory = Address::generate(&env);
    let qa = Address::generate(&env);
    let (token_address, sac) = setup_token(&env);

    let contract_id = env.register(Fairfoundry, ());
    let client = FairfoundryClient::new(&env, &contract_id);

    client.init(
        &oem,
        &factory,
        &qa,
        &payment_asset(&token_address),
        &pricing(&env),
        &ers(&env),
        &InitConfig {
            min_escrow_lots: 1u32,
            min_qa_stake: 50_000_000i128,
            oem_bond: 0i128,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &500_000_000);

    client.stake_qa(&qa, &200_000_000);
    client.deposit_escrow(&oem, &5_000_000_000);

    // Create a lot and open a challenge to lock stake
    let lot_id = String::from_str(&env, "PROP-1");
    client.create_lot(&factory, &lot_id, &100u32);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    client.qa_commit_serials(&qa, &lot_id, &BytesN::from_array(&env, &[2u8; 32]), &100u32);
    client.qa_update_counts(&qa, &lot_id, &100, &95, &5);
    client.request_reinspect(
        &oem,
        &lot_id,
        &5u32,
        &600u64,
        &BytesN::from_array(&env, &[1u8; 32]),
    );

    let st = client.view_state();
    assert!(
        st.qa_locked_stake <= st.qa_stake,
        "Locked stake must never exceed total stake"
    );
}

#[test]
fn approved_units_lte_produced_units() {
    let env = setup_env();
    let oem = Address::generate(&env);
    let factory = Address::generate(&env);
    let qa = Address::generate(&env);
    let (token_address, sac) = setup_token(&env);

    let contract_id = env.register(Fairfoundry, ());
    let client = FairfoundryClient::new(&env, &contract_id);

    client.init(
        &oem,
        &factory,
        &qa,
        &payment_asset(&token_address),
        &pricing(&env),
        &ers(&env),
        &InitConfig {
            min_escrow_lots: 1u32,
            min_qa_stake: 50_000_000i128,
            oem_bond: 0i128,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &500_000_000);

    client.stake_qa(&qa, &100_000_000);
    client.deposit_escrow(&oem, &5_000_000_000);

    let ap_names = ["AP-0", "AP-1", "AP-2"];
    for i in 0..3u32 {
        let lot_id = String::from_str(&env, ap_names[i as usize]);
        let qty = (i + 1) * 100;
        client.create_lot(&factory, &lot_id, &qty);
        client.qa_commit(
            &qa,
            &lot_id,
            &BytesN::from_array(&env, &[i as u8; 32]),
            &String::from_str(&env, "ipfs://x"),
        );
        client.qa_commit_serials(
            &qa,
            &lot_id,
            &BytesN::from_array(&env, &[(i + 10) as u8; 32]),
            &qty,
        );
        let passed = qty - (i + 1) * 5;
        let failed = (i + 1) * 5;
        client.qa_update_counts(&qa, &lot_id, &qty, &passed, &failed);
        client.execute_payment(&lot_id);
    }

    let analytics = client.view_analytics();
    assert!(
        analytics.total_units_approved <= analytics.total_units_produced,
        "Approved units must never exceed produced units"
    );
}

#[test]
fn lot_count_invariant_holds() {
    let env = setup_env();
    let oem = Address::generate(&env);
    let factory = Address::generate(&env);
    let qa = Address::generate(&env);
    let (token_address, sac) = setup_token(&env);

    let contract_id = env.register(Fairfoundry, ());
    let client = FairfoundryClient::new(&env, &contract_id);

    client.init(
        &oem,
        &factory,
        &qa,
        &payment_asset(&token_address),
        &pricing(&env),
        &ers(&env),
        &InitConfig {
            min_escrow_lots: 1u32,
            min_qa_stake: 50_000_000i128,
            oem_bond: 0i128,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &500_000_000);

    client.stake_qa(&qa, &100_000_000);
    client.deposit_escrow(&oem, &5_000_000_000);

    let lot_id = String::from_str(&env, "CNT-1");
    client.create_lot(&factory, &lot_id, &500u32);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    client.qa_commit_serials(&qa, &lot_id, &BytesN::from_array(&env, &[2u8; 32]), &500u32);
    client.qa_update_counts(&qa, &lot_id, &500, &475, &25);

    let lot = client.view_lot(&lot_id);
    assert_eq!(
        lot.tested,
        lot.passed + lot.failed,
        "tested must equal passed + failed"
    );
}

#[test]
fn sample_indices_unique_and_bounded() {
    let env = setup_env();
    let oem = Address::generate(&env);
    let factory = Address::generate(&env);
    let qa = Address::generate(&env);
    let (token_address, sac) = setup_token(&env);

    let contract_id = env.register(Fairfoundry, ());
    let client = FairfoundryClient::new(&env, &contract_id);

    client.init(
        &oem,
        &factory,
        &qa,
        &payment_asset(&token_address),
        &pricing(&env),
        &ers(&env),
        &InitConfig {
            min_escrow_lots: 1u32,
            min_qa_stake: 50_000_000i128,
            oem_bond: 0i128,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &500_000_000);

    client.stake_qa(&qa, &100_000_000);
    client.deposit_escrow(&oem, &5_000_000_000);

    let lot_id = String::from_str(&env, "SAMP-1");
    let quantity = 1000u32;
    client.create_lot(&factory, &lot_id, &quantity);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    client.qa_commit_serials(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[2u8; 32]),
        &quantity,
    );
    client.qa_update_counts(&qa, &lot_id, &quantity, &950, &50);

    let indices = client.request_reinspect(
        &oem,
        &lot_id,
        &20u32,
        &600u64,
        &BytesN::from_array(&env, &[42u8; 32]),
    );

    // All indices should be unique
    for i in 0..indices.len() {
        for j in (i + 1)..indices.len() {
            assert_ne!(
                indices.get(i).unwrap(),
                indices.get(j).unwrap(),
                "Sample indices must be unique"
            );
        }
    }

    // All indices should be < quantity
    for idx in indices.iter() {
        assert!(idx < quantity, "Sample index must be < quantity");
    }
}

#[test]
fn unstake_preserves_minimum() {
    let env = setup_env();
    let oem = Address::generate(&env);
    let factory = Address::generate(&env);
    let qa = Address::generate(&env);
    let (token_address, sac) = setup_token(&env);

    let contract_id = env.register(Fairfoundry, ());
    let client = FairfoundryClient::new(&env, &contract_id);

    let min_qa_stake = 100_000_000i128;
    client.init(
        &oem,
        &factory,
        &qa,
        &payment_asset(&token_address),
        &pricing(&env),
        &ers(&env),
        &InitConfig {
            min_escrow_lots: 1u32,
            min_qa_stake,
            oem_bond: 0i128,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&qa, &500_000_000);
    client.stake_qa(&qa, &200_000_000);

    // Unstake down to exactly min — should succeed
    client.request_unstake_qa(&qa, &100_000_000);

    let st = client.view_state();
    assert!(
        st.qa_stake >= min_qa_stake,
        "QA stake must remain >= min_qa_stake"
    );
}

#[test]
fn challenge_cost_matches_formula() {
    let env = setup_env();
    let oem = Address::generate(&env);
    let factory = Address::generate(&env);
    let qa = Address::generate(&env);
    let (token_address, sac) = setup_token(&env);

    let contract_id = env.register(Fairfoundry, ());
    let client = FairfoundryClient::new(&env, &contract_id);

    client.init(
        &oem,
        &factory,
        &qa,
        &payment_asset(&token_address),
        &pricing(&env),
        &ers(&env),
        &InitConfig {
            min_escrow_lots: 1u32,
            min_qa_stake: 50_000_000i128,
            oem_bond: 0i128,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &500_000_000);

    client.stake_qa(&qa, &100_000_000);
    client.deposit_escrow(&oem, &5_000_000_000);

    let lot_id = String::from_str(&env, "COST-1");
    let quantity = 1000u32;
    client.create_lot(&factory, &lot_id, &quantity);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    client.qa_commit_serials(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[2u8; 32]),
        &quantity,
    );
    client.qa_update_counts(&qa, &lot_id, &quantity, &950, &50);

    let escrow_before = client.view_state().escrow_balance;
    client.request_reinspect(
        &oem,
        &lot_id,
        &10u32,
        &600u64,
        &BytesN::from_array(&env, &[1u8; 32]),
    );
    let escrow_after = client.view_state().escrow_balance;

    // Challenge cost = lot_value * 10 / 10000 = lot_value * 0.1%
    // lot_value = 950 * 1_000_000 * (1 - 50/10000) = 950_000_000 * 0.995 = 945_250_000
    // challenge_cost = 945_250_000 * 10 / 10000 = 945_250
    let expected_cost = 945_250i128;
    let actual_cost = escrow_before - escrow_after;
    assert_eq!(
        actual_cost, expected_cost,
        "Challenge cost must match BPS formula"
    );
}
