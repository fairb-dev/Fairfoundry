use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    token, Address, BytesN, Env, Map, String, Vec,
};

use crate::{
    AssetKind, DeploymentModel, DiscountTier, Fairfoundry, FairfoundryClient, InitConfig,
    OracleConfig, PaymentAsset, Pricing, ERS,
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

/// Sets up a fully initialized contract with funded accounts. Returns (client, oem, factory, qa).
fn setup_full(env: &Env) -> (FairfoundryClient<'_>, Address, Address, Address) {
    let oem = Address::generate(env);
    let factory = Address::generate(env);
    let qa = Address::generate(env);

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
            fairbuild_treasury: Address::generate(&env),
            deployment_model: DeploymentModel::CloudHosted,
            dispute_window_secs: 1800u64,
        },
        &Vec::<OracleConfig>::new(env),
    );

    sac.mint(&oem, &10_000_000_000);
    sac.mint(&qa, &1_000_000_000);
    sac.mint(&factory, &1_000_000_000);

    client.stake_qa(&qa, &200_000_000);
    client.deposit_escrow(&oem, &5_000_000_000);

    (client, oem, factory, qa)
}

// --- Auth failure tests ---

#[test]
#[should_panic]
fn factory_cannot_deposit_escrow() {
    let env = setup_env();
    let (client, _oem, factory, _qa) = setup_full(&env);
    client.deposit_escrow(&factory, &1_000_000);
}

#[test]
#[should_panic]
fn qa_cannot_create_lot() {
    let env = setup_env();
    let (client, _oem, _factory, qa) = setup_full(&env);
    client.create_lot(&qa, &String::from_str(&env, "LOT-X"), &100u32);
}

#[test]
#[should_panic]
fn oem_cannot_commit_qa() {
    let env = setup_env();
    let (client, oem, factory, _qa) = setup_full(&env);

    let lot_id = String::from_str(&env, "LOT-X");
    client.create_lot(&factory, &lot_id, &100u32);
    client.qa_commit(
        &oem,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
}

#[test]
#[should_panic]
fn factory_cannot_stake_qa() {
    let env = setup_env();
    let (client, _oem, factory, _qa) = setup_full(&env);
    client.stake_qa(&factory, &100_000_000);
}

// --- Parameter validation tests ---

#[test]
#[should_panic]
fn zero_lot_quantity() {
    let env = setup_env();
    let (client, _oem, factory, _qa) = setup_full(&env);
    client.create_lot(&factory, &String::from_str(&env, "LOT-Z"), &0u32);
}

#[test]
#[should_panic]
fn lot_quantity_exceeds_max() {
    let env = setup_env();
    let (client, _oem, factory, _qa) = setup_full(&env);
    client.create_lot(&factory, &String::from_str(&env, "LOT-BIG"), &1_000_001u32);
}

#[test]
#[should_panic]
fn duplicate_lot_id() {
    let env = setup_env();
    let (client, _oem, factory, _qa) = setup_full(&env);
    let lot_id = String::from_str(&env, "LOT-DUP");
    client.create_lot(&factory, &lot_id, &100u32);
    client.create_lot(&factory, &lot_id, &200u32);
}

#[test]
#[should_panic]
fn invalid_test_counts_mismatch() {
    let env = setup_env();
    let (client, _oem, factory, qa) = setup_full(&env);
    let lot_id = String::from_str(&env, "LOT-TC");
    client.create_lot(&factory, &lot_id, &100u32);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    // tested (100) != passed (50) + failed (40) — should panic
    client.qa_update_counts(&qa, &lot_id, &100, &50, &40);
}

#[test]
#[should_panic]
fn tested_exceeds_quantity() {
    let env = setup_env();
    let (client, _oem, factory, qa) = setup_full(&env);
    let lot_id = String::from_str(&env, "LOT-TEQ");
    client.create_lot(&factory, &lot_id, &100u32);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    // tested (200) > quantity (100) — should panic
    client.qa_update_counts(&qa, &lot_id, &200, &180, &20);
}

// --- Status transition tests ---

#[test]
#[should_panic]
fn payment_on_non_approved_lot() {
    let env = setup_env();
    let (client, _oem, factory, qa) = setup_full(&env);
    let lot_id = String::from_str(&env, "LOT-PAY");
    client.create_lot(&factory, &lot_id, &100u32);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    // Lot is InQA, not Approved — should panic
    client.execute_payment(&lot_id);
}

#[test]
#[should_panic]
fn double_payment_same_lot() {
    let env = setup_env();
    let (client, _oem, factory, qa) = setup_full(&env);
    let lot_id = String::from_str(&env, "LOT-DBL");
    client.create_lot(&factory, &lot_id, &100u32);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    client.qa_commit_serials(&qa, &lot_id, &BytesN::from_array(&env, &[2u8; 32]), &100u32);
    client.qa_update_counts(&qa, &lot_id, &100, &95, &5);
    client.execute_payment(&lot_id);
    // Second payment — lot is now Paid, should panic
    client.execute_payment(&lot_id);
}

#[test]
#[should_panic]
fn payment_with_open_challenge() {
    let env = setup_env();
    let (client, oem, factory, qa) = setup_full(&env);
    let lot_id = String::from_str(&env, "LOT-OCH");
    client.create_lot(&factory, &lot_id, &100u32);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    client.qa_commit_serials(&qa, &lot_id, &BytesN::from_array(&env, &[2u8; 32]), &100u32);
    client.qa_update_counts(&qa, &lot_id, &100, &95, &5);

    // Create open challenge
    client.request_reinspect(
        &oem,
        &lot_id,
        &5u32,
        &600u64,
        &BytesN::from_array(&env, &[1u8; 32]),
    );
    // Try to pay while challenge is Open — should panic
    client.execute_payment(&lot_id);
}

// --- Challenge tests ---

#[test]
#[should_panic]
fn slash_before_deadline() {
    let env = setup_env();
    let (client, oem, factory, qa) = setup_full(&env);
    let lot_id = String::from_str(&env, "LOT-SBD");
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
    // Try to slash immediately (before deadline) — should panic
    client.challenge_default_slash(&factory, &lot_id, &500u32);
}

#[test]
#[should_panic]
fn slash_above_max_bps() {
    let env = setup_env();
    let (client, oem, factory, qa) = setup_full(&env);
    let lot_id = String::from_str(&env, "LOT-SMX");
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

    let mut li = env.ledger().get();
    li.timestamp += 601;
    env.ledger().set(li);

    // slash_bps = 2001 > MAX_SLASH_BPS (2000) — should panic
    client.challenge_default_slash(&factory, &lot_id, &2001u32);
}

#[test]
#[should_panic]
fn challenge_rate_limit_exceeded() {
    let env = setup_env();
    let (client, oem, factory, qa) = setup_full(&env);

    // Create a lot and prepare it for challenges
    let lot_id = String::from_str(&env, "LOT-RL");
    client.create_lot(&factory, &lot_id, &100u32);
    client.qa_commit(
        &qa,
        &lot_id,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    client.qa_commit_serials(&qa, &lot_id, &BytesN::from_array(&env, &[2u8; 32]), &100u32);
    client.qa_update_counts(&qa, &lot_id, &100, &95, &5);

    // File 5 challenges (need to respond + create new lot for each since lot_id is keyed)
    let lot_names = ["LOT-RL0", "LOT-RL1", "LOT-RL2", "LOT-RL3", "LOT-RL4"];
    for i in 0..5u32 {
        let lid = String::from_str(&env, lot_names[i as usize]);
        client.create_lot(&factory, &lid, &100u32);
        client.qa_commit(
            &qa,
            &lid,
            &BytesN::from_array(&env, &[1u8; 32]),
            &String::from_str(&env, "ipfs://x"),
        );
        client.qa_commit_serials(&qa, &lid, &BytesN::from_array(&env, &[2u8; 32]), &100u32);
        client.qa_update_counts(&qa, &lid, &100, &95, &5);
        let seed = BytesN::from_array(&env, &[(i as u8) + 10; 32]);
        client.request_reinspect(&oem, &lid, &3u32, &600u64, &seed);
    }

    // 6th challenge within the same hour — should panic
    let lid6 = String::from_str(&env, "LOT-RL6");
    client.create_lot(&factory, &lid6, &100u32);
    client.qa_commit(
        &qa,
        &lid6,
        &BytesN::from_array(&env, &[1u8; 32]),
        &String::from_str(&env, "ipfs://x"),
    );
    client.qa_commit_serials(&qa, &lid6, &BytesN::from_array(&env, &[2u8; 32]), &100u32);
    client.qa_update_counts(&qa, &lid6, &100, &95, &5);
    client.request_reinspect(
        &oem,
        &lid6,
        &3u32,
        &600u64,
        &BytesN::from_array(&env, &[99u8; 32]),
    );
}
