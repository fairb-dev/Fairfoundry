use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    token, Address, BytesN, Env, Map, String, Vec,
};

use crate::{
    AssetKind, DiscountTier, Fairfoundry, FairfoundryClient, InitConfig, OracleConfig, OrderStatus,
    PaymentAsset, Pricing, ServiceRequest, ServiceStage, ERS,
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

fn addr(env: &Env) -> Address {
    Address::generate(env)
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
        min_qty: 1000,
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
        max_defect_bps: 300,
        specs,
    }
}

fn setup_full<'a>(env: &Env) -> (FairfoundryClient<'a>, Address, Address, Address, Address) {
    let oem = addr(env);
    let factory = addr(env);
    let qa = addr(env);
    let oracle = addr(env);

    let (token_address, sac) = setup_token(env);

    let contract_id = env.register(Fairfoundry, ());
    let client = FairfoundryClient::new(env, &contract_id);

    client.init(
        &oem,
        &factory,
        &qa,
        &payment_asset(&token_address),
        &pricing(env),
        &ers(env),
        &InitConfig {
            min_escrow_lots: 1u32,
            min_qa_stake: 100_000_000i128,
            oem_bond: 0i128,
            dispute_window_secs: 3600u64,
        },
        &Vec::<OracleConfig>::new(env),
    );

    // Mint and fund
    sac.mint(&oem, &50_000_000_000);
    sac.mint(&qa, &1_000_000_000);

    client.stake_qa(&qa, &200_000_000);
    client.deposit_escrow(&oem, &20_000_000_000);

    // Register oracle
    client.register_fairbuild_oracle(&oem, &oracle);

    (client, oem, factory, qa, oracle)
}

fn sample_service_request(env: &Env) -> ServiceRequest {
    let mut criteria: Map<String, u32> = Map::new(env);
    criteria.set(String::from_str(env, "thermal_pass"), 95);
    criteria.set(String::from_str(env, "visual_pass"), 100);

    let mut artifacts: Vec<String> = Vec::new(env);
    artifacts.push_back(String::from_str(env, "thermal_image"));
    artifacts.push_back(String::from_str(env, "xray_scan"));

    ServiceRequest {
        description: String::from_str(env, "Thermal cycle 50 EVT samples"),
        stage: ServiceStage::EVT,
        quantity: 50,
        ers_version: 1,
        acceptance_criteria: criteria,
        required_artifacts: artifacts,
    }
}

// =================== Happy Path Tests ===================

#[test]
fn service_fabric_happy_path_direct_payment() {
    let env = setup_env();
    let (client, oem, factory, _qa, oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-001");
    let agreed_price = 500_000_000i128;

    // 1. OEM creates a service order
    client.create_service_order(
        &oem,
        &order_id,
        &sample_service_request(&env),
        &agreed_price,
    );

    let order = client.view_service_order(&order_id);
    assert_eq!(order.status, OrderStatus::Requested);
    assert_eq!(order.escrow_locked, agreed_price);

    // Escrow should be reduced
    let state = client.view_state();
    assert_eq!(state.escrow_balance, 20_000_000_000 - agreed_price);

    // 2. Factory accepts
    client.accept_service_order(&factory, &order_id);
    let order = client.view_service_order(&order_id);
    assert_eq!(order.status, OrderStatus::Accepted);

    // 3. Factory submits artifacts (production images uploaded)
    let artifacts_root = BytesN::from_array(&env, &[0xABu8; 32]);
    client.submit_artifacts(&factory, &order_id, &artifacts_root);
    let order = client.view_service_order(&order_id);
    assert_eq!(order.status, OrderStatus::Delivered);

    // 4. FairBuild oracle attests completion (finds images in OEM DB)
    let mut criteria_met: Map<String, u32> = Map::new(&env);
    criteria_met.set(String::from_str(&env, "thermal_pass"), 98);
    criteria_met.set(String::from_str(&env, "visual_pass"), 100);

    client.attest_completion(
        &oracle,
        &order_id,
        &BytesN::from_array(&env, &[0xCDu8; 32]),
        &50u32,
        &criteria_met,
        &String::from_str(&env, "ipfs://validation-report-001"),
    );

    let order = client.view_service_order(&order_id);
    assert_eq!(order.status, OrderStatus::Validated);
    assert!(order.svt_id > 0);

    // Verify SVT was recorded
    let svt_order = client.view_svt(&order.svt_id);
    assert_eq!(svt_order, order_id);

    // 5. Settle — direct payment to factory
    let paid = client.settle_service(&order_id, &false);
    assert_eq!(paid, agreed_price);

    let order = client.view_service_order(&order_id);
    assert_eq!(order.status, OrderStatus::Settled);
    assert!(!order.settled_as_credit);

    // Check analytics
    let analytics = client.view_service_analytics();
    assert_eq!(analytics.total_orders, 1);
    assert_eq!(analytics.total_validated, 1);
    assert_eq!(analytics.total_settled, 1);
    assert_eq!(analytics.total_svts_minted, 1);
}

#[test]
fn service_fabric_happy_path_credit_settlement() {
    let env = setup_env();
    let (client, oem, factory, _qa, oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-002");
    let agreed_price = 300_000_000i128;

    client.create_service_order(
        &oem,
        &order_id,
        &sample_service_request(&env),
        &agreed_price,
    );
    client.accept_service_order(&factory, &order_id);
    client.submit_artifacts(&factory, &order_id, &BytesN::from_array(&env, &[1u8; 32]));

    let mut criteria_met: Map<String, u32> = Map::new(&env);
    criteria_met.set(String::from_str(&env, "thermal_pass"), 96);

    client.attest_completion(
        &oracle,
        &order_id,
        &BytesN::from_array(&env, &[2u8; 32]),
        &50u32,
        &criteria_met,
        &String::from_str(&env, "ipfs://report-002"),
    );

    // Settle as credit
    let credited = client.settle_service(&order_id, &true);
    assert_eq!(credited, agreed_price);

    // Check credit balance
    let credits = client.view_credits(&factory);
    assert_eq!(credits, agreed_price);

    let order = client.view_service_order(&order_id);
    assert!(order.settled_as_credit);

    // Analytics
    let analytics = client.view_service_analytics();
    assert_eq!(analytics.total_credits_issued, agreed_price);
}

#[test]
fn credit_accumulation_and_redemption() {
    let env = setup_env();
    let (client, oem, factory, _qa, oracle) = setup_full(&env);

    // Create and settle two orders as credits
    for i in 0..2u32 {
        let order_id = String::from_str(&env, if i == 0 { "SVC-A" } else { "SVC-B" });
        let price = 200_000_000i128;

        client.create_service_order(&oem, &order_id, &sample_service_request(&env), &price);
        client.accept_service_order(&factory, &order_id);
        client.submit_artifacts(
            &factory,
            &order_id,
            &BytesN::from_array(&env, &[(i as u8) + 10; 32]),
        );

        let criteria_met: Map<String, u32> = Map::new(&env);
        client.attest_completion(
            &oracle,
            &order_id,
            &BytesN::from_array(&env, &[(i as u8) + 20; 32]),
            &50u32,
            &criteria_met,
            &String::from_str(&env, "ipfs://report"),
        );

        client.settle_service(&order_id, &true);
    }

    // Credits should accumulate
    assert_eq!(client.view_credits(&factory), 400_000_000);

    // Redeem half
    client.redeem_credits(&factory, &200_000_000);
    assert_eq!(client.view_credits(&factory), 200_000_000);

    // Redeem rest
    client.redeem_credits(&factory, &200_000_000);
    assert_eq!(client.view_credits(&factory), 0);

    let analytics = client.view_service_analytics();
    assert_eq!(analytics.total_credits_issued, 400_000_000);
    assert_eq!(analytics.total_credits_redeemed, 400_000_000);
}

#[test]
fn cancel_service_order_returns_escrow() {
    let env = setup_env();
    let (client, oem, factory, _qa, _oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-CANCEL");
    let price = 1_000_000_000i128;

    let state_before = client.view_state();
    let escrow_before = state_before.escrow_balance;

    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &price);

    // Escrow reduced
    let state_mid = client.view_state();
    assert_eq!(state_mid.escrow_balance, escrow_before - price);

    // Accept then cancel
    client.accept_service_order(&factory, &order_id);
    client.cancel_service_order(&oem, &order_id);

    let order = client.view_service_order(&order_id);
    assert_eq!(order.status, OrderStatus::Cancelled);
    assert_eq!(order.escrow_locked, 0);

    // Escrow restored
    let state_after = client.view_state();
    assert_eq!(state_after.escrow_balance, escrow_before);
}

#[test]
fn multi_stage_service_orders() {
    let env = setup_env();
    let (client, oem, factory, _qa, oracle) = setup_full(&env);

    let stages = [
        (ServiceStage::EVT, "SVC-EVT"),
        (ServiceStage::DVT, "SVC-DVT"),
        (ServiceStage::PVT, "SVC-PVT"),
        (ServiceStage::MP, "SVC-MP"),
    ];

    for (stage, id_str) in &stages {
        let order_id = String::from_str(&env, id_str);
        let mut req = sample_service_request(&env);
        req.stage = stage.clone();

        client.create_service_order(&oem, &order_id, &req, &100_000_000);
        client.accept_service_order(&factory, &order_id);
        client.submit_artifacts(
            &factory,
            &order_id,
            &BytesN::from_array(&env, &[0x44u8; 32]),
        );

        let criteria_met: Map<String, u32> = Map::new(&env);
        client.attest_completion(
            &oracle,
            &order_id,
            &BytesN::from_array(&env, &[0x55u8; 32]),
            &50u32,
            &criteria_met,
            &String::from_str(&env, "ipfs://multi-stage-report"),
        );
        client.settle_service(&order_id, &false);
    }

    let analytics = client.view_service_analytics();
    assert_eq!(analytics.total_orders, 4);
    assert_eq!(analytics.total_settled, 4);
    assert_eq!(analytics.total_svts_minted, 4);
}

#[test]
fn view_service_orders_filter() {
    let env = setup_env();
    let (client, oem, factory, _qa, _oracle) = setup_full(&env);

    client.create_service_order(
        &oem,
        &String::from_str(&env, "F-1"),
        &sample_service_request(&env),
        &100_000_000,
    );
    client.create_service_order(
        &oem,
        &String::from_str(&env, "F-2"),
        &sample_service_request(&env),
        &100_000_000,
    );
    client.accept_service_order(&factory, &String::from_str(&env, "F-1"));

    // All orders
    let all = client.view_service_orders(&None);
    assert_eq!(all.len(), 2);

    // Only requested
    let requested = client.view_service_orders(&Some(OrderStatus::Requested));
    assert_eq!(requested.len(), 1);

    // Only accepted
    let accepted = client.view_service_orders(&Some(OrderStatus::Accepted));
    assert_eq!(accepted.len(), 1);
}

// =================== Negative Tests ===================

#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn factory_cannot_create_service_order() {
    let env = setup_env();
    let (client, _oem, factory, _qa, _oracle) = setup_full(&env);

    client.create_service_order(
        &factory,
        &String::from_str(&env, "SVC-BAD"),
        &sample_service_request(&env),
        &100_000_000,
    );
}

#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn oem_cannot_accept_service_order() {
    let env = setup_env();
    let (client, oem, _factory, _qa, _oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-AUTH");
    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &100_000_000);

    // OEM tries to accept — should fail
    client.accept_service_order(&oem, &order_id);
}

#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn oem_cannot_submit_artifacts() {
    let env = setup_env();
    let (client, oem, factory, _qa, _oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-ART");
    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &100_000_000);
    client.accept_service_order(&factory, &order_id);

    // OEM tries to submit — should fail
    client.submit_artifacts(&oem, &order_id, &BytesN::from_array(&env, &[0u8; 32]));
}

#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn unauthorized_oracle_cannot_attest() {
    let env = setup_env();
    let (client, oem, factory, _qa, _oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-UNAUTH");
    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &100_000_000);
    client.accept_service_order(&factory, &order_id);
    client.submit_artifacts(&factory, &order_id, &BytesN::from_array(&env, &[1u8; 32]));

    // Random address tries to attest
    let fake_oracle = addr(&env);
    let criteria: Map<String, u32> = Map::new(&env);
    client.attest_completion(
        &fake_oracle,
        &order_id,
        &BytesN::from_array(&env, &[2u8; 32]),
        &50u32,
        &criteria,
        &String::from_str(&env, "ipfs://fake"),
    );
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn cannot_attest_before_delivery() {
    let env = setup_env();
    let (client, oem, factory, _qa, oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-EARLY");
    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &100_000_000);
    client.accept_service_order(&factory, &order_id);

    // Try to attest while still Accepted (not Delivered)
    let criteria: Map<String, u32> = Map::new(&env);
    client.attest_completion(
        &oracle,
        &order_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &50u32,
        &criteria,
        &String::from_str(&env, "ipfs://early"),
    );
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn cannot_settle_before_validation() {
    let env = setup_env();
    let (client, oem, factory, _qa, _oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-NOSVT");
    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &100_000_000);
    client.accept_service_order(&factory, &order_id);
    client.submit_artifacts(&factory, &order_id, &BytesN::from_array(&env, &[1u8; 32]));

    // Try to settle while still Delivered (not Validated)
    client.settle_service(&order_id, &false);
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn cannot_cancel_after_delivery() {
    let env = setup_env();
    let (client, oem, factory, _qa, _oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-LATE-CANCEL");
    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &100_000_000);
    client.accept_service_order(&factory, &order_id);
    client.submit_artifacts(&factory, &order_id, &BytesN::from_array(&env, &[1u8; 32]));

    // Try to cancel after delivery
    client.cancel_service_order(&oem, &order_id);
}

#[test]
#[should_panic(expected = "Error(Contract, #6)")]
fn duplicate_order_id_fails() {
    let env = setup_env();
    let (client, oem, _factory, _qa, _oracle) = setup_full(&env);

    let order_id = String::from_str(&env, "SVC-DUP");
    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &100_000_000);
    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &100_000_000);
}

#[test]
#[should_panic(expected = "Error(Contract, #3)")]
fn insufficient_escrow_for_order() {
    let env = setup_env();
    let (client, oem, _factory, _qa, _oracle) = setup_full(&env);

    // Try to create order for more than escrow balance
    client.create_service_order(
        &oem,
        &String::from_str(&env, "SVC-RICH"),
        &sample_service_request(&env),
        &999_999_999_999i128,
    );
}

#[test]
#[should_panic(expected = "Error(Contract, #3)")]
fn redeem_more_credits_than_available() {
    let env = setup_env();
    let (client, _oem, factory, _qa, _oracle) = setup_full(&env);

    // Factory has 0 credits — try to redeem
    client.redeem_credits(&factory, &100_000_000);
}

// =================== Property Tests ===================

#[test]
fn escrow_conservation_across_service_orders() {
    let env = setup_env();
    let (client, oem, factory, _qa, oracle) = setup_full(&env);

    let initial_escrow = client.view_state().escrow_balance;
    let price = 500_000_000i128;

    // Create order — locks funds
    let order_id = String::from_str(&env, "SVC-CONSERVE");
    client.create_service_order(&oem, &order_id, &sample_service_request(&env), &price);
    assert_eq!(client.view_state().escrow_balance, initial_escrow - price);

    // Complete and settle directly
    client.accept_service_order(&factory, &order_id);
    client.submit_artifacts(&factory, &order_id, &BytesN::from_array(&env, &[1u8; 32]));
    let criteria: Map<String, u32> = Map::new(&env);
    client.attest_completion(
        &oracle,
        &order_id,
        &BytesN::from_array(&env, &[2u8; 32]),
        &50u32,
        &criteria,
        &String::from_str(&env, "ipfs://conserve"),
    );
    client.settle_service(&order_id, &false);

    // Escrow remains reduced (funds went to factory)
    assert_eq!(client.view_state().escrow_balance, initial_escrow - price);
}

#[test]
fn svt_ids_are_monotonically_increasing() {
    let env = setup_env();
    let (client, oem, factory, _qa, oracle) = setup_full(&env);

    let mut last_svt = 0u64;
    for i in 0..3u32 {
        let id = match i {
            0 => "M-1",
            1 => "M-2",
            _ => "M-3",
        };
        let order_id = String::from_str(&env, id);
        client.create_service_order(&oem, &order_id, &sample_service_request(&env), &100_000_000);
        client.accept_service_order(&factory, &order_id);
        client.submit_artifacts(
            &factory,
            &order_id,
            &BytesN::from_array(&env, &[(i as u8) + 30; 32]),
        );
        let criteria: Map<String, u32> = Map::new(&env);
        client.attest_completion(
            &oracle,
            &order_id,
            &BytesN::from_array(&env, &[(i as u8) + 40; 32]),
            &50u32,
            &criteria,
            &String::from_str(&env, "ipfs://monotonic"),
        );

        let order = client.view_service_order(&order_id);
        assert!(order.svt_id > last_svt);
        last_svt = order.svt_id;
    }
}
