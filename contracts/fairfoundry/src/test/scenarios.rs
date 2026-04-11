use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    token, Address, BytesN, Env, Map, String, Symbol, Vec,
};

use crate::{
    AssetKind, DeploymentModel, DiscountTier, Fairfoundry, FairfoundryClient, InitConfig,
    LotStatus, OracleConfig, PaymentAsset, Pricing, ERS,
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
    tiers.push_back(DiscountTier {
        min_qty: 2000,
        discount_bps: 100,
    });
    Pricing {
        price_per_unit: 1_000_000,
        defect_penalty_bps: 150,
        tiers,
    }
}

fn ers(env: &Env) -> ERS {
    let specs: Map<String, u32> = Map::new(env);
    ERS {
        version: 1,
        max_defect_bps: 400,
        specs,
    }
}

#[test]
fn multi_lot_pipeline() {
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
            min_qa_stake: 100_000_000i128,
            oem_bond: 0i128,
            fairbuild_treasury: Address::generate(&env),
            deployment_model: DeploymentModel::CloudHosted,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&oem, &50_000_000_000);
    sac.mint(&qa, &2_000_000_000);

    client.stake_qa(&qa, &500_000_000);
    client.deposit_escrow(&oem, &20_000_000_000);

    // 3 lots through full lifecycle
    let quantities = [1000u32, 2000, 3000];
    let mut total_paid = 0i128;

    let multi_names = ["MULTI-0", "MULTI-1", "MULTI-2"];
    for (i, &qty) in quantities.iter().enumerate() {
        let lot_id = String::from_str(&env, multi_names[i]);
        client.create_lot(&factory, &lot_id, &qty);

        client.qa_commit(
            &qa,
            &lot_id,
            &BytesN::from_array(&env, &[i as u8; 32]),
            &String::from_str(&env, "ipfs://report"),
        );
        client.qa_commit_serials(
            &qa,
            &lot_id,
            &BytesN::from_array(&env, &[(i as u8) + 10; 32]),
            &qty,
        );

        let passed = qty - (qty / 20); // 5% defect rate
        let failed = qty / 20;
        client.qa_update_counts(&qa, &lot_id, &qty, &passed, &failed);

        let lot = client.view_lot(&lot_id);
        assert_eq!(lot.status, LotStatus::Approved);

        let paid = client.execute_payment(&lot_id);
        assert!(paid > 0);
        total_paid += paid;

        let lot = client.view_lot(&lot_id);
        assert_eq!(lot.status, LotStatus::Paid);
    }

    assert!(total_paid > 0);
    let analytics = client.view_analytics();
    assert_eq!(analytics.total_units_produced, 6000);
    assert!(analytics.total_units_approved <= 6000);

    // view_lots should show all 3 lots
    let all_lots = client.view_lots(&None);
    assert_eq!(all_lots.len(), 3);

    // Filter for Paid lots
    let paid_lots = client.view_lots(&Some(LotStatus::Paid));
    assert_eq!(paid_lots.len(), 3);
}

#[test]
fn ers_governance_proposal() {
    let env = setup_env();
    let oem = Address::generate(&env);
    let factory = Address::generate(&env);
    let qa = Address::generate(&env);
    let (token_address, _sac) = setup_token(&env);

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
            min_qa_stake: 0i128,
            oem_bond: 0i128,
            fairbuild_treasury: Address::generate(&env),
            deployment_model: DeploymentModel::CloudHosted,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    // Propose new ERS
    let new_ers = ERS {
        version: 2,
        max_defect_bps: 200,
        specs: Map::new(&env),
    };

    client.propose_ers(&oem, &new_ers, &7200u64);

    let pending = client.view_pending_ers();
    assert!(!pending.is_empty());

    let update = pending.get(0).unwrap();
    assert_eq!(update.payload.version, 2);
    assert_eq!(update.payload.max_defect_bps, 200);
    assert!(!update.timelock.executed);
    // Delay should be at least MIN_TIMELOCK_DELAY (3600)
    assert!(update.timelock.eta >= 1_700_000_000 + 3600);
}

#[test]
fn qa_unstake_lifecycle() {
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
            fairbuild_treasury: Address::generate(&env),
            deployment_model: DeploymentModel::CloudHosted,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&qa, &1_000_000_000);
    client.stake_qa(&qa, &300_000_000);

    // Request unstake of 150M (leaves 150M which is >= min 100M)
    client.request_unstake_qa(&qa, &150_000_000);

    let requests = client.view_unstake_requests();
    assert_eq!(requests.len(), 1);

    let st = client.view_state();
    assert_eq!(st.qa_stake, 150_000_000);

    // Try to execute before delay — nothing should be unstaked
    let unstaked = client.execute_unstake_qa(&qa);
    assert_eq!(unstaked, 0);

    // Advance time past QA_UNSTAKE_DELAY (7 days = 604800 seconds)
    let mut li = env.ledger().get();
    li.timestamp += 604801;
    env.ledger().set(li);

    // Now execute — should unstake the full amount
    let unstaked = client.execute_unstake_qa(&qa);
    assert_eq!(unstaked, 150_000_000);

    let requests = client.view_unstake_requests();
    assert_eq!(requests.len(), 0);
}

#[test]
fn oracle_freshness_blocks_payment() {
    let env = setup_env();
    let oem = Address::generate(&env);
    let factory = Address::generate(&env);
    let qa = Address::generate(&env);
    let oracle = Address::generate(&env);
    let (token_address, sac) = setup_token(&env);

    let contract_id = env.register(Fairfoundry, ());
    let client = FairfoundryClient::new(&env, &contract_id);

    let oracle_config = OracleConfig {
        oracle: oracle.clone(),
        quote: Symbol::new(&env, "USD"),
        max_age_secs: 3600,
        enabled: true,
        last_price: 1_000_000,
        last_update: 1_700_000_000, // same as ledger timestamp
    };

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
            fairbuild_treasury: Address::generate(&env),
            deployment_model: DeploymentModel::CloudHosted,
            dispute_window_secs: 1800u64,
        },
        &soroban_sdk::vec![&env, oracle_config],
    );

    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &500_000_000);

    client.stake_qa(&qa, &100_000_000);
    client.deposit_escrow(&oem, &5_000_000_000);

    let lot_id = String::from_str(&env, "ORACLE-1");
    client.create_lot(&factory, &lot_id, &100u32);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    client.qa_commit_serials(&qa, &lot_id, &BytesN::from_array(&env, &[2u8; 32]), &100u32);
    client.qa_update_counts(&qa, &lot_id, &100, &95, &5);

    // Advance time to make oracle stale (> 3600 seconds)
    let mut li = env.ledger().get();
    li.timestamp += 3601;
    env.ledger().set(li);

    // Payment should fail due to stale oracle
    let result = client.try_execute_payment(&lot_id);
    assert!(result.is_err(), "Payment should fail with stale oracle");

    // Update oracle price
    client.update_oracle_price(&oracle, &1_100_000);

    // Now payment should succeed
    let paid = client.execute_payment(&lot_id);
    assert!(paid > 0);
}

#[test]
fn challenge_fee_refund_on_timely_response() {
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
            min_qa_stake: 100_000_000i128,
            oem_bond: 0i128,
            fairbuild_treasury: Address::generate(&env),
            deployment_model: DeploymentModel::CloudHosted,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(&env),
    );

    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &1_000_000_000);

    client.stake_qa(&qa, &200_000_000);
    client.deposit_escrow(&oem, &5_000_000_000);

    let lot_id = String::from_str(&env, "REFUND-1");
    client.create_lot(&factory, &lot_id, &1_000u32);
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
        &1_000u32,
    );
    client.qa_update_counts(&qa, &lot_id, &1_000, &950, &50);

    let escrow_before = client.view_state().escrow_balance;

    // Request reinspection (OEM pays from escrow)
    client.request_reinspect(
        &oem,
        &lot_id,
        &10u32,
        &600u64,
        &BytesN::from_array(&env, &[1u8; 32]),
    );

    let escrow_after_challenge = client.view_state().escrow_balance;
    let fee = escrow_before - escrow_after_challenge;
    assert!(fee > 0, "Challenge fee should be non-zero");

    // QA responds timely — fee should be refunded
    client.qa_reinspect_respond(
        &qa,
        &lot_id,
        &10u32,
        &0u32,
        &BytesN::from_array(&env, &[0u8; 32]),
    );

    // After timely response, the challenge cost is refunded to the requester (OEM)
    // The refund goes to the OEM address directly, not back to escrow
    let challenge = client.view_challenge(&lot_id);
    assert_eq!(challenge.cost_paid, fee);
}
