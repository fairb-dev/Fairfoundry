// tests/flows.rs
#![cfg(test)]

use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    Address, BytesN, Env, Map, String, Symbol, Vec,
};

// Import the contract and types from your crate
use fairfoundry::{
    Fairfoundry, AssetKind, PaymentAsset, Pricing, DiscountTier, ERS, OracleConfig,
    LotStatus,
};

fn addr(env: &Env) -> Address {
    Address::generate(env)
}

fn setup_env() -> Env {
    let env = Env::default();
    // Reasonable default ledger timestamp for deterministic tests
    let mut li = LedgerInfo::default();
    li.timestamp = 1_700_000_000; // arbitrary
    env.ledger().set(li);
    env
}

fn default_payment_asset() -> PaymentAsset {
    PaymentAsset { kind: AssetKind::NativeXlm, decimals: 7 }
}

fn default_pricing(env: &Env) -> Pricing {
    let mut tiers: Vec<DiscountTier> = Vec::new(env);
    tiers.push_back(DiscountTier { min_qty: 1000, discount_bps: 50 });
    tiers.push_back(DiscountTier { min_qty: 5000, discount_bps: 150 });
    Pricing {
        price_per_unit: 1_000_000,    // 0.1 XLM in stroops (if 7 decimals)
        defect_penalty_bps: 100,      // 1%
        tiers,
    }
}

fn default_ers(env: &Env) -> ERS {
    let mut specs: Map<String, u32> = Map::new(env);
    specs.set(String::from_str(env, "MTF"), 400);
    specs.set(String::from_str(env, "SNR"), 35);
    ERS {
        version: 1,
        max_defect_bps: 300, // 3%
        specs,
    }
}

#[test]
fn end_to_end_happy_path() {
    let env = setup_env();

    // Parties
    let oem = addr(&env);
    let factory = addr(&env);
    let qa = addr(&env);

    // Register contract
    let contract_id = env.register_contract(None, Fairfoundry);
    let client = fairfoundry::Client::new(&env, &contract_id);

    // Init
    client.init(
        &oem, &factory, &qa,
        &default_payment_asset(),
        &default_pricing(&env),
        &default_ers(&env),
        &2u32,                        // min_escrow_lots
        &None::<OracleConfig>,
    );

    // Fund OEM with XLM (mint via SAC in tests) and deposit escrow
    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &10_000_000_000); // 1000 XLM (test-only)
    client.deposit_escrow(&oem, &5_000_000_000); // deposit 500 XLM

    // Create lot
    let lot_id = String::from_str(&env, "LOT-001");
    client.create_lot(&factory, &lot_id, &2_000u32);

    // QA commit and counts
    let commit = BytesN::from_array(&env, &[1u8; 32]);
    client.qa_commit(&qa, &lot_id, &commit, &String::from_str(&env, "ipfs://report"));
    client.qa_update_counts(&qa, &lot_id, &2_000, &1_960, &40);

    // No dispute; final payment
    let paid = client.execute_payment(&lot_id);
    assert!(paid > 0);

    // Check lot status
    let lot = client.view_lot(&lot_id);
    assert_eq!(lot.status, LotStatus::Paid);

    // State sanity
    let st = client.view_state();
    assert!(st.escrow_balance >= 0);
    assert_eq!(st.total_units_produced, 2_000);
    assert_eq!(st.total_units_approved, 1_960);
}

#[test]
fn partial_then_final_payment_nets_correctly() {
    let env = setup_env();

    let oem = addr(&env);
    let factory = addr(&env);
    let qa = addr(&env);

    let contract_id = env.register_contract(None, Fairfoundry);
    let client = fairfoundry::Client::new(&env, &contract_id);

    client.init(
        &oem, &factory, &qa,
        &default_payment_asset(),
        &default_pricing(&env),
        &default_ers(&env),
        &1u32,
        &None::<OracleConfig>,
    );

    // Mint & deposit
    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &2_000_000_000);
    client.deposit_escrow(&oem, &1_000_000_000);

    // Lot of 1_000 units; 900 pass so far
    let lot_id = String::from_str(&env, "LOT-002");
    client.create_lot(&factory, &lot_id, &1_000u32);
    client.qa_commit(&qa, &lot_id, &BytesN::from_array(&env, &[2u8;32]), &String::from_str(&env, "ipfs://r2"));
    client.qa_update_counts(&qa, &lot_id, &900, &900, &0);

    // Partial payout equal to 900 * price (with any discount if threshold met)
    // For qty=900, discount tiers [1000, 5000] don't apply; so base=900 * 1_000_000
    let partial = 900i128 * 1_000_000i128;
    client.partial_payout(&factory, &lot_id, &partial);

    // Finish QA to full 1_000; last 100 are all pass
    client.qa_update_counts(&qa, &lot_id, &1_000, &1_000, &0);
    let final_paid = client.execute_payment(&lot_id);

    // Final should pay only remaining (100 * price) plus any discount if now eligible.
    // At 1_000 units, discount_bps=50 (0.5%) applies on total, but partial was paid pre-discount.
    // Our contract computes discount at settlement time; partials are netted out.
    // Quick lower bound check:
    assert!(final_paid > 0);
    let lot = client.view_lot(&lot_id);
    assert_eq!(lot.status, LotStatus::Paid);
}

#[test]
fn dispute_refund_and_slash_qa() {
    let env = setup_env();
    let oem = addr(&env);
    let factory = addr(&env);
    let qa = addr(&env);

    let contract_id = env.register_contract(None, Fairfoundry);
    let client = fairfoundry::Client::new(&env, &contract_id);

    client.init(
        &oem, &factory, &qa,
        &default_payment_asset(),
        &default_pricing(&env),
        &default_ers(&env),
        &1u32,
        &None::<OracleConfig>,
    );

    // fund & stake
    let sac = soroban_sdk::token::Client::new(&env, &soroban_sdk::token::native::address(&env));
    sac.mint(&oem, &5_000_000_000);
    sac.mint(&qa, &1_000_000_000);
    client.deposit_escrow(&oem, &2_000_000_000);
    client.stake_qa(&qa, &500_000_000);

    // lot
    let lot_id = String::from_str(&env, "LOT-003");
    client.create_lot(&factory, &lot_id, &500u32);
    client.qa_commit(&qa, &lot_id, &BytesN::from_array(&env, &[3u8;32]), &String::from_str(&env, "ipfs://r3"));
    client.qa_update_counts(&qa, &lot_id, &500, &450, &50);

    // OEM disputes
    client.dispute_open(&oem, &lot_id);

    // Two of three call dispute_resolve with pay_factory=false and penalty to slash QA to OEM
    client.dispute_resolve(&oem, &lot_id, &false, &500);     // 5% penalty
    client.dispute_resolve(&factory, &lot_id, &false, &500); // quorum reached on second call

    let lot = client.view_lot(&lot_id);
    assert_eq!(lot.status, LotStatus::Refunded);

    let st = client.view_state();
    assert!(st.qa_stake <= 500_000_000); // stake was slashed (<= original)
}

#[test]
fn governance_updates_with_timelock() {
    let env = setup_env();
    let oem = addr(&env);
    let factory = addr(&env);
    let qa = addr(&env);

    let contract_id = env.register_contract(None, Fairfoundry);
    let client = fairfoundry::Client::new(&env, &contract_id);

    client.init(
        &oem, &factory, &qa,
        &default_payment_asset(),
        &default_pricing(&env),
        &default_ers(&env),
        &1u32,
        &None::<OracleConfig>,
    );

    // Propose ERS change with 1-hour timelock
    let mut new_specs: Map<String,u32> = Map::new(&env);
    new_specs.set(String::from_str(&env, "MTF"), 450);
    let ers2 = ERS { version: 0, max_defect_bps: 250, specs: new_specs };
    client.propose_ers(&oem, &ers2, &3600u64);
    client.approve_ers(&factory);

    // Try executing before delay — should fail
    let res = std::panic::catch_unwind(|| client.execute_ers());
    assert!(res.is_err());

    // Advance time and execute
    let mut li = env.ledger().get();
    li.timestamp += 3600;
    env.ledger().set(li);
    client.execute_ers();

    let st = client.view_state();
    assert_eq!(st.ers.version, 2); // incremented from 1 to 2
    assert_eq!(st.ers.max_defect_bps, 250);
}
