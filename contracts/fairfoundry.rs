#![no_std]
#![allow(clippy::too_many_arguments)]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, BytesN, Env, Map, String,
    Symbol, Vec, log, panic_with_error,
};

// =====================================================
//                        Errors
// =====================================================
#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Err {
    NotAuthorized = 1,
    InvalidState = 2,
    InsufficientEscrow = 3,
    InvalidCounts = 4,
    NotFound = 5,
    AlreadyExists = 6,
    TimelockActive = 7,
    AlreadyExecuted = 8,
    OracleStale = 9,
    Param = 10,
}

// =====================================================
//                    Roles & Config
// =====================================================
#[derive(Clone)]
#[contracttype]
pub struct Roles {
    pub oem: Address,     // buyer
    pub factory: Address, // manufacturer
    pub qa: Address,      // third-party QA (e.g., Fairbuild)
}

#[derive(Clone)]
#[contracttype]
pub enum AssetKind {
    NativeXlm,               // Native XLM via SAC
    StellarAsset(BytesN<32>),// Any SAC token (e.g., USDC)
}

#[derive(Clone)]
#[contracttype]
pub struct PaymentAsset {
    pub kind: AssetKind,
    // assumption: price_per_unit is expressed in the smallest unit of this asset
    pub decimals: u32, // informational; not used in math except for UI
}

impl PaymentAsset {
    fn client<'a>(&self, env: &'a Env) -> token::Client<'a> {
        match &self.kind {
            AssetKind::NativeXlm => {
                let sac_addr = token::native::address(env);
                token::Client::new(env, &sac_addr)
            }
            AssetKind::StellarAsset(cid) => {
                let addr = Address::from_contract_id(env, cid);
                token::Client::new(env, &addr)
            }
        }
    }
}

// =====================================================
//                     Governance Core
// =====================================================
#[derive(Clone)]
#[contracttype]
pub struct Timelock {
    pub eta: u64,              // earliest execution timestamp
    pub approvals: Vec<Address>,
    pub executed: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct PendingUpdate<T> {
    pub payload: T,
    pub requested_at: u64,
    pub timelock: Timelock,
}

fn quorum_ok(approvals: &Vec<Address>) -> bool { approvals.len() >= 2 }

fn now(env: &Env) -> u64 { env.ledger().timestamp() }

// =====================================================
//                     Commercial Terms
// =====================================================
#[derive(Clone)]
#[contracttype]
pub struct DiscountTier {
    pub min_qty: u32,        // inclusive
    pub discount_bps: u32,   // basis points, 10_000 = 100%
}

#[derive(Clone)]
#[contracttype]
pub struct Pricing {
    pub price_per_unit: i128,        // in smallest unit of PaymentAsset
    pub defect_penalty_bps: u32,     // penalty applied if defect rate > ERS threshold
    pub tiers: Vec<DiscountTier>,    // sorted ascending by min_qty (assumption)
}

#[derive(Clone)]
#[contracttype]
pub struct ERS {
    pub version: u32,
    pub max_defect_bps: u32,        // acceptable defect rate threshold (bps)
    pub specs: Map<String, u32>,    // flexible numeric params (e.g., MTF, SNR, etc.)
}

// Optional external price oracle (price the unit in quote asset, settle in pay asset).
// If not configured, we use fixed pricing.
#[derive(Clone)]
#[contracttype]
pub struct OracleConfig {
    pub oracle: Address,       // contract address implementing IOracle
    pub quote: Symbol,         // e.g., "USD"
    pub max_age_secs: u64,     // freshness requirement
    pub enabled: bool,
}

// Interface we assume for the oracle (keep minimal).
// fn price(quote: Symbol) -> (i128 price, u64 decimals, u64 ts)
pub trait IOracle {
    fn price(env: &Env, quote: Symbol) -> (i128, u64, u64);
}

// =====================================================
//                         Lots & QA
// =====================================================
#[derive(Clone, PartialEq)]
#[contracttype]
pub enum LotStatus { Open, InQA, Approved, Disputed, Paid, Refunded, Closed }

#[derive(Clone)]
#[contracttype]
pub struct QAMetadata {
    pub commit_root: BytesN<32>, // commit to per-unit results (Merkle root)
    pub report_uri: String,      // optional off-chain (IPFS/S3)
}

#[derive(Clone)]
#[contracttype]
pub struct Lot {
    pub lot_id: String,
    pub quantity: u32,
    pub tested: u32,
    pub passed: u32,
    pub failed: u32,
    pub status: LotStatus,
    pub qa_commit: Option<QAMetadata>,
    pub created_at: u64,
    pub last_update: u64,
    pub pay_nonce: u32,              // idempotency
    pub partial_paid_amount: i128,   // for partial payouts
}

// =====================================================
//                         State
// =====================================================
#[derive(Clone)]
#[contracttype]
pub struct State {
    pub roles: Roles,
    pub pay_asset: PaymentAsset,
    pub pricing: Pricing,
    pub ers: ERS,
    pub oracle: Option<OracleConfig>,
    pub min_escrow_lots: u32,     // escrow coverage requirement
    pub escrow_balance: i128,
    pub qa_stake: i128,           // staked by QA for slashable accountability
    pub paused: bool,
    pub total_units_produced: u64,
    pub total_units_approved: u64,

    // Governance queues
    pub ers_pending: Option<PendingUpdate<ERS>>,
    pub pricing_pending: Option<PendingUpdate<Pricing>>,
    pub upgrade_pending: Option<PendingUpdate<BytesN<32>>>, // wasm hash
}

// =====================================================
//                       Storage Keys
// =====================================================
const S: Symbol = Symbol::short("S");
const LOTS: Symbol = Symbol::short("LOTS");
// approval accumulator for dispute resolutions keyed by (symbol, lot_id)
const RESOLVE_KEY: Symbol = Symbol::short("RESOLVE");

// =====================================================
//                    Helper Guards & Utils
// =====================================================
fn is_party(who: &Address, r: &Roles) -> bool {
    who == &r.oem || who == &r.factory || who == &r.qa
}
fn require_party(env: &Env, who: &Address, r: &Roles) {
    who.require_auth();
    if !is_party(who, r) { panic_with_error!(env, Err::NotAuthorized); }
}
fn require_not_paused(env: &Env, st: &State) {
    if st.paused { panic_with_error!(env, Err::InvalidState); }
}

fn calc_discount_bps(tiers: &Vec<DiscountTier>, qty: u32) -> i128 {
    let mut d: i128 = 0;
    for t in tiers.iter() {
        if qty >= t.min_qty { d = t.discount_bps as i128; }
    }
    d
}

fn compute_price_for_lot(pr: &Pricing, passed: u32) -> i128 {
    let base = (passed as i128) * pr.price_per_unit;
    let disc_bps = calc_discount_bps(&pr.tiers, passed);
    if disc_bps > 0 {
        base - (base * disc_bps / 10_000)
    } else { base }
}

// Optional oracle sanity: price() returns (px, decimals, ts). We just sanity-check freshness.
fn ensure_oracle_fresh(env: &Env, oc: &OracleConfig) {
    // In a real integration, we'd call into oc.oracle to get ts and compare.
    // Here we only enforce the flag; wire-up is left as an integration task.
    if !oc.enabled { return; }
    // Placeholder: in production, call IOracle::price and compare ts.
    // If stale, panic_with_error!(env, Err::OracleStale);
}

// =====================================================
//                     Main Contract
// =====================================================
#[contract]
pub struct PrecisionManufacturing;

#[contractimpl]
impl PrecisionManufacturing {
    // -------------------- Init --------------------
    pub fn init(
        env: Env,
        oem: Address,
        factory: Address,
        qa: Address,
        pay_asset: PaymentAsset,
        pricing: Pricing,
        ers: ERS,
        min_escrow_lots: u32,
        oracle: Option<OracleConfig>,
    ) {
        oem.require_auth();
        factory.require_auth();
        qa.require_auth();

        // light validation
        if pricing.price_per_unit <= 0 { panic_with_error!(&env, Err::Param); }

        let st = State{
            roles: Roles { oem, factory, qa },
            pay_asset,
            pricing,
            ers,
            oracle,
            min_escrow_lots,
            escrow_balance: 0,
            qa_stake: 0,
            paused: false,
            total_units_produced: 0,
            total_units_approved: 0,
            ers_pending: None,
            pricing_pending: None,
            upgrade_pending: None,
        };
        env.storage().persistent().set(&S, &st);
        env.storage().persistent().set(&LOTS, &Map::<String,Lot>::new(&env));
        log!(&env, "pm:init");
    }

    // -------------------- Escrow & Stake --------------------
    pub fn deposit_escrow(env: Env, from: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &from, &st.roles);
        if from != st.roles.oem { panic_with_error!(&env, Err::NotAuthorized); }
        let c = st.pay_asset.client(&env);
        c.transfer(&from, &env.current_contract_address(), &amount);
        st.escrow_balance += amount;
        env.events().publish(("EscrowDeposited",), (from.clone(), amount));
        env.storage().persistent().set(&S, &st);
    }

    pub fn withdraw_escrow(env: Env, oem: Address, amount: i128) {
        // OEM can withdraw unused escrow if not locked by outstanding min_escrow_lots requirements.
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &oem, &st.roles);
        if oem != st.roles.oem { panic_with_error!(&env, Err::NotAuthorized); }
        // Note: For simplicity we allow withdrawal up to current escrow (ops policy may restrict more).
        if amount > st.escrow_balance { panic_with_error!(&env, Err::InsufficientEscrow); }
        st.escrow_balance -= amount;
        let c = st.pay_asset.client(&env);
        c.transfer(&env.current_contract_address(), &oem, &amount);
        env.events().publish(("EscrowWithdrawn",), (oem, amount));
        env.storage().persistent().set(&S, &st);
    }

    pub fn stake_qa(env: Env, qa: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        if qa != st.roles.qa { panic_with_error!(&env, Err::NotAuthorized); }
        let c = st.pay_asset.client(&env);
        c.transfer(&qa, &env.current_contract_address(), &amount);
        st.qa_stake += amount;
        env.events().publish(("QAStaked",), (qa, amount));
        env.storage().persistent().set(&S, &st);
    }

    // -------------------- Lots Lifecycle --------------------
    pub fn create_lot(env: Env, factory: Address, lot_id: String, quantity: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &factory, &st.roles);
        if factory != st.roles.factory { panic_with_error!(&env, Err::NotAuthorized); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        if lots.contains_key(lot_id.clone()) { panic_with_error!(&env, Err::AlreadyExists); }

        // escrow coverage check: min_escrow_lots of THIS lot payable amount at list price
        let required_per_lot = (st.pricing.price_per_unit as i128) * (quantity as i128);
        let min_required = required_per_lot * (st.min_escrow_lots as i128);
        if st.escrow_balance < min_required { panic_with_error!(&env, Err::InsufficientEscrow); }

        let lot = Lot{
            lot_id: lot_id.clone(),
            quantity,
            tested: 0, passed: 0, failed: 0,
            status: LotStatus::Open,
            qa_commit: None,
            created_at: now(&env),
            last_update: now(&env),
            pay_nonce: 0,
            partial_paid_amount: 0,
        };

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        env.events().publish(("LotCreated",), (lot_id, quantity));
    }

    pub fn qa_commit(env: Env, qa: Address, lot_id: String, commit_root: BytesN<32>, report_uri: String) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &qa, &st.roles);
        if qa != st.roles.qa { panic_with_error!(&env, Err::NotAuthorized); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if lot.status != LotStatus::Open && lot.status != LotStatus::InQA { panic_with_error!(&env, Err::InvalidState); }

        lot.qa_commit = Some(QAMetadata{ commit_root, report_uri });
        lot.status = LotStatus::InQA;
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        env.events().publish(("QACommitted",), (lot_id,));
    }

    pub fn qa_update_counts(env: Env, qa: Address, lot_id: String, tested: u32, passed: u32, failed: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        if qa != st.roles.qa { panic_with_error!(&env, Err::NotAuthorized); }
        if tested != passed + failed { panic_with_error!(&env, Err::InvalidCounts); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if tested > lot.quantity { panic_with_error!(&env, Err::InvalidCounts); }

        lot.tested = tested; lot.passed = passed; lot.failed = failed;
        lot.status = if tested == lot.quantity { LotStatus::Approved } else { LotStatus::InQA };
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot.clone());
        env.storage().persistent().set(&LOTS, &lots);
        env.events().publish(("QAUpdated",), (lot_id, tested, passed, failed));
    }

    // OEM can dispute an Approved lot within a business-policy window (not enforced here).
    pub fn dispute_open(env: Env, oem: Address, lot_id: String) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &oem, &st.roles);
        if oem != st.roles.oem { panic_with_error!(&env, Err::NotAuthorized); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if lot.status != LotStatus::Approved { panic_with_error!(&env, Err::InvalidState); }

        lot.status = LotStatus::Disputed;
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        env.events().publish(("LotDisputed",), (lot_id,));
    }

    // 2-of-3 dispute resolution. penalty_bps can direct a penalty allocation.
    // If pay_factory=true: factory is paid base-penalty; penalty may slash QA stake to OEM.
    // Else: full refund to OEM; optional penalty slashes QA stake to OEM.
    pub fn dispute_resolve(env: Env, caller: Address, lot_id: String, pay_factory: bool, penalty_bps: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if lot.status != LotStatus::Disputed { panic_with_error!(&env, Err::InvalidState); }

        // collect approvals
        let mut approvals: Map<(Symbol,String), Vec<Address>> =
            env.storage().persistent().get(&RESOLVE_KEY).unwrap_or(Map::new(&env));
        let key = (RESOLVE_KEY, lot_id.clone());
        let mut a = approvals.get(key.clone()).unwrap_or(Vec::new(&env));
        if !a.contains(caller.clone()) { a.push_back(caller.clone()); }
        approvals.set(key.clone(), a.clone());
        env.storage().persistent().set(&RESOLVE_KEY, &approvals);

        if a.len() < 2 { return; } // wait for quorum

        let c = st.pay_asset.client(&env);
        let base = compute_price_for_lot(&st.pricing, lot.passed);
        let penalty = (base * (penalty_bps as i128))/10_000;

        if pay_factory {
            let pay = base - penalty;
            if pay > 0 {
                c.transfer(&env.current_contract_address(), &st.roles.factory, &pay);
                st.escrow_balance -= pay;
            }
            if penalty > 0 && st.qa_stake >= penalty {
                st.qa_stake -= penalty;
                c.transfer(&env.current_contract_address(), &st.roles.oem, &penalty);
            }
            lot.status = LotStatus::Paid;
        } else {
            // refund to OEM
            if base > 0 {
                c.transfer(&env.current_contract_address(), &st.roles.oem, &base);
                st.escrow_balance -= base;
            }
            if penalty > 0 && st.qa_stake >= penalty {
                st.qa_stake -= penalty;
                c.transfer(&env.current_contract_address(), &st.roles.oem, &penalty);
            }
            lot.status = LotStatus::Refunded;
        }

        lot.last_update = now(&env);
        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        env.storage().persistent().set(&S, &st);
        env.events().publish(("DisputeResolved",), (lot_id, pay_factory, penalty_bps));
    }

    // -------------------- Payments --------------------
    // Partial payout (e.g., 30% at packaging). Capped by value of currently "tested->passed".
    pub fn partial_payout(env: Env, caller: Address, lot_id: String, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);
        require_not_paused(&env, &st);

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if lot.status != LotStatus::InQA && lot.status != LotStatus::Approved { panic_with_error!(&env, Err::InvalidState); }

        // Cap: cannot pay more than computed price for currently passed units (minus already paid).
        let cap = compute_price_for_lot(&st.pricing, lot.passed) - lot.partial_paid_amount;
        if amount <= 0 || amount > cap { panic_with_error!(&env, Err::Param); }

        let c = st.pay_asset.client(&env);
        c.transfer(&env.current_contract_address(), &st.roles.factory, &amount);
        st.escrow_balance -= amount;

        lot.partial_paid_amount += amount;
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        env.storage().persistent().set(&S, &st);

        env.events().publish(("LotPartialPaid",), (lot_id, amount));
    }

    // Final settlement (idempotent via pay_nonce). Applies defect penalty when above ERS threshold.
    pub fn execute_payment(env: Env, lot_id: String) -> i128 {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);

        if let Some(oc) = &st.oracle { ensure_oracle_fresh(&env, oc); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if lot.status != LotStatus::Approved { panic_with_error!(&env, Err::InvalidState); }

        let mut payment = compute_price_for_lot(&st.pricing, lot.passed);

        // apply defect penalty if needed
        let defect_bps = if lot.tested > 0 { (lot.failed as i128) * 10_000 / (lot.tested as i128) } else { 0 };
        if defect_bps > (st.ers.max_defect_bps as i128) {
            payment -= (payment * (st.pricing.defect_penalty_bps as i128)) / 10_000;
        }

        // subtract partials already paid
        if lot.partial_paid_amount > 0 {
            payment -= lot.partial_paid_amount;
        }
        if payment <= 0 {
            // nothing left to pay; mark closed
            lot.status = LotStatus::Closed;
            lot.pay_nonce += 1;
            lot.last_update = now(&env);
            lots.set(lot_id.clone(), lot);
            env.storage().persistent().set(&LOTS, &lots);
            return 0;
        }

        // transfer and update
        let c = st.pay_asset.client(&env);
        c.transfer(&env.current_contract_address(), &st.roles.factory, &payment);
        st.escrow_balance -= payment;
        st.total_units_produced += lot.quantity as u64;
        st.total_units_approved += lot.passed as u64;

        lot.status = LotStatus::Paid;
        lot.pay_nonce += 1;
        lot.last_update = now(&env);

        env.storage().persistent().set(&S, &st);
        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);

        env.events().publish(("LotPaid",), (lot_id, payment));
        payment
    }

    // -------------------- Governance: ERS / Pricing (2-of-3 + timelock) --------------------
    pub fn propose_ers(env: Env, caller: Address, ers: ERS, delay_secs: u64) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);

        let tl = Timelock{ eta: now(&env) + delay_secs, approvals: vec![&env, caller], executed: false };
        st.ers_pending = Some(PendingUpdate{ payload: ers, requested_at: now(&env), timelock: tl });
        env.storage().persistent().set(&S, &st);
        env.events().publish(("ERSProposed",), ());
    }

    pub fn approve_ers(env: Env, approver: Address) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &approver, &st.roles);
        let mut p = st.ers_pending.clone().unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if !p.timelock.approvals.contains(approver.clone()) { p.timelock.approvals.push_back(approver); }
        st.ers_pending = Some(p);
        env.storage().persistent().set(&S, &st);
    }

    pub fn execute_ers(env: Env) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        let mut p = st.ers_pending.clone().unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if p.timelock.executed { panic_with_error!(&env, Err::AlreadyExecuted); }
        if !quorum_ok(&p.timelock.approvals) { panic_with_error!(&env, Err::NotAuthorized); }
        if now(&env) < p.timelock.eta { panic_with_error!(&env, Err::TimelockActive); }

        let mut new = p.payload;
        new.version = st.ers.version + 1;
        st.ers = new;

        p.timelock.executed = true;
        st.ers_pending = None;
        env.storage().persistent().set(&S, &st);
        env.events().publish(("ERSUpdated",), (st.ers.version,));
    }

    pub fn propose_pricing(env: Env, caller: Address, pricing: Pricing, delay_secs: u64) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);
        if pricing.price_per_unit <= 0 { panic_with_error!(&env, Err::Param); }
        let tl = Timelock{ eta: now(&env) + delay_secs, approvals: vec![&env, caller], executed: false };
        st.pricing_pending = Some(PendingUpdate{ payload: pricing, requested_at: now(&env), timelock: tl });
        env.storage().persistent().set(&S, &st);
        env.events().publish(("PricingProposed",), ());
    }

    pub fn approve_pricing(env: Env, approver: Address) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &approver, &st.roles);
        let mut p = st.pricing_pending.clone().unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if !p.timelock.approvals.contains(approver.clone()) { p.timelock.approvals.push_back(approver); }
        st.pricing_pending = Some(p);
        env.storage().persistent().set(&S, &st);
    }

    pub fn execute_pricing(env: Env) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        let mut p = st.pricing_pending.clone().unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if p.timelock.executed { panic_with_error!(&env, Err::AlreadyExecuted); }
        if !quorum_ok(&p.timelock.approvals) { panic_with_error!(&env, Err::NotAuthorized); }
        if now(&env) < p.timelock.eta { panic_with_error!(&env, Err::TimelockActive); }
        st.pricing = p.payload;
        p.timelock.executed = true;
        st.pricing_pending = None;
        env.storage().persistent().set(&S, &st);
        env.events().publish(("PricingUpdated",), ());
    }

    // -------------------- Pause / Unpause (2-of-3) --------------------
    pub fn pause(env: Env, a: Address, b: Address) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &a, &st.roles); require_party(&env, &b, &st.roles);
        if a == b { panic_with_error!(&env, Err::NotAuthorized); }
        st.paused = true;
        env.storage().persistent().set(&S, &st);
        env.events().publish(("Paused",), ());
    }
    pub fn unpause(env: Env, a: Address, b: Address) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &a, &st.roles); require_party(&env, &b, &st.roles);
        if a == b { panic_with_error!(&env, Err::NotAuthorized); }
        st.paused = false;
        env.storage().persistent().set(&S, &st);
        env.events().publish(("Unpaused",), ());
    }

    // -------------------- Views --------------------
    pub fn view_state(env: Env) -> State { env.storage().persistent().get(&S).unwrap() }

    pub fn view_lot(env: Env, lot_id: String) -> Lot {
        let lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        lots.get(lot_id).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound))
    }

    pub fn view_pending(env: Env) -> (Option<PendingUpdate<ERS>>, Option<PendingUpdate<Pricing>>) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        (st.ers_pending, st.pricing_pending)
    }
}
