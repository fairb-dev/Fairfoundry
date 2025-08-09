// contracts/fairfoundry.rs
// Fairfoundry: Soroban contract for QA-verified manufacturing settlements
// License: CC BY-NC 4.0 (Non-commercial). Add this header to all redistributed copies.
//
// Extras added:
// - Testbench attestation (bench_id, firmware hash, signer)
// - Unit serial numbers: committed via Merkle root with count
// - Re-inspection challenge flow with deterministic sampling and deadlines
//
// NOTE: This is a demonstration contract. Some cryptographic verifications
// (e.g., Merkle inclusion proofs) are out of scope here to keep gas and code size reasonable.
// Instead, we anchor commitments and enforce via staking & deadlines.

#![no_std]
#![allow(clippy::too_many_arguments)]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, BytesN, Env, Map, String,
    Symbol, Vec, log, panic_with_error,
};

// ============================ Errors ============================
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
    TooEarlyOrLate = 11,
    Reentrancy = 12,
    NoChallenge = 13,
}

// ======================== Roles & Assets ========================
#[derive(Clone)]
#[contracttype]
pub struct Roles {
    pub oem: Address,
    pub factory: Address,
    pub qa: Address,
}

#[derive(Clone)]
#[contracttype]
pub enum AssetKind {
    NativeXlm,
    StellarAsset(BytesN<32>),
}

#[derive(Clone)]
#[contracttype]
pub struct PaymentAsset {
    pub kind: AssetKind,
    pub decimals: u32, // informational (UI)
}

impl PaymentAsset {
    fn client<'a>(&self, env: &'a Env) -> token::Client<'a> {
        match &self.kind {
            AssetKind::NativeXlm => {
                let sac = token::native::address(env);
                token::Client::new(env, &sac)
            }
            AssetKind::StellarAsset(cid) => {
                let a = Address::from_contract_id(env, cid);
                token::Client::new(env, &a)
            }
        }
    }
}

// ===================== Governance & Timelock =====================
#[derive(Clone)]
#[contracttype]
pub struct Timelock {
    pub eta: u64,
    pub approvals: Vec<Address>,
    pub executed: bool,
}
fn quorum_ok(a: &Vec<Address>) -> bool { a.len() >= 2 }
fn now(env: &Env) -> u64 { env.ledger().timestamp() }

#[derive(Clone)]
#[contracttype]
pub struct PendingUpdate<T> {
    pub payload: T,
    pub requested_at: u64,
    pub timelock: Timelock,
}

// ======================= Commercial Terms =======================
#[derive(Clone)]
#[contracttype]
pub struct DiscountTier {
    pub min_qty: u32,
    pub discount_bps: u32,
}

#[derive(Clone)]
#[contracttype]
pub struct Pricing {
    pub price_per_unit: i128,
    pub defect_penalty_bps: u32,
    pub tiers: Vec<DiscountTier>,
}

#[derive(Clone)]
#[contracttype]
pub struct ERS {
    pub version: u32,
    pub max_defect_bps: u32,
    pub specs: Map<String, u32>,
}

// Optional oracle config (placeholder; wire in when ready)
#[derive(Clone)]
#[contracttype]
pub struct OracleConfig {
    pub oracle: Address,
    pub quote: Symbol,
    pub max_age_secs: u64,
    pub enabled: bool,
}

pub trait IOracle {
    fn price(env: &Env, quote: Symbol) -> (i128, u64, u64);
}

// ============================ Lots & QA ==========================
#[derive(Clone, PartialEq)]
#[contracttype]
pub enum LotStatus { Open, InQA, Approved, Disputed, Paid, Refunded, Closed }

#[derive(Clone)]
#[contracttype]
pub struct TestbenchAttestation {
    pub bench_id: String,
    pub firmware_hash: BytesN<32>,
    pub signer: Address, // lab account or QA signer
}

#[derive(Clone)]
#[contracttype]
pub struct QAMetadata {
    pub commit_root: BytesN<32>, // commit to per-unit results (Merkle root over per-unit QC rows)
    pub report_uri: String,      // optional off-chain (IPFS/S3)
    // Extras:
    pub serials_root: Option<BytesN<32>>, // Merkle root over H(serial||salt) list
    pub serials_count: u32,               // number of units read
    pub bench: Option<TestbenchAttestation>,
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
    pub pay_nonce: u32,
    pub partial_paid_amount: i128,
}

// ============================= Challenges ============================
#[derive(Clone, PartialEq)]
#[contracttype]
pub enum ChallengeStatus { Open, Responded, Expired }

#[derive(Clone)]
#[contracttype]
pub struct Challenge {
    pub requested_by: Address,
    pub seed: BytesN<32>,
    pub sample_size: u32,
    pub sample_indices: Vec<u32>, // deterministic indices in [0, serials_count)
    pub requested_at: u64,
    pub due_by: u64,
    pub status: ChallengeStatus,
}

// ============================= State ============================
#[derive(Clone)]
#[contracttype]
pub struct State {
    pub roles: Roles,
    pub pay_asset: PaymentAsset,
    pub pricing: Pricing,
    pub ers: ERS,
    pub oracle: Option<OracleConfig>,

    pub min_escrow_lots: u32,
    pub escrow_balance: i128,

    // QA stake requirements
    pub min_qa_stake: i128,
    pub qa_stake: i128,

    // OEM performance bond
    pub oem_bond: i128,

    // Dispute window after approval
    pub dispute_window_secs: u64,

    pub paused: bool,
    pub total_units_produced: u64,
    pub total_units_approved: u64,

    // governance queues
    pub ers_pending: Option<PendingUpdate<ERS>>,
    pub pricing_pending: Option<PendingUpdate<Pricing>>,
    pub roles_pending: Option<PendingUpdate<Roles>>,
    pub upgrade_pending: Option<PendingUpdate<BytesN<32>>>,

    pub entered: bool, // reentrancy guard
}

// =========================== Storage Keys =======================
const S: Symbol = Symbol::short("S");
const LOTS: Symbol = Symbol::short("LOTS");
const RESOLVE_KEY: Symbol = Symbol::short("RESOLVE");
const CHAL: Symbol = Symbol::short("CHAL"); // challenges map (lot_id -> Challenge)

// ============================ Helpers ===========================
fn is_party(who: &Address, r: &Roles) -> bool { who == &r.oem || who == &r.factory || who == &r.qa }
fn require_party(env: &Env, who: &Address, r: &Roles) {
    who.require_auth();
    if !is_party(who, r) { panic_with_error!(env, Err::NotAuthorized); }
}
fn require_not_paused(env: &Env, st: &State) {
    if st.paused { panic_with_error!(env, Err::InvalidState); }
}
fn enter(env: &Env, st: &mut State) {
    if st.entered { panic_with_error!(env, Err::Reentrancy); }
    st.entered = true;
    env.storage().persistent().set(&S, st);
}
fn exit(env: &Env, st: &mut State) {
    st.entered = false;
    env.storage().persistent().set(&S, st);
}
fn calc_discount_bps(tiers: &Vec<DiscountTier>, qty: u32) -> i128 {
    let mut d = 0i128;
    for t in tiers.iter() {
        if qty >= t.min_qty { d = t.discount_bps as i128; }
    }
    d
}
fn compute_price_for_lot(pr: &Pricing, passed: u32) -> i128 {
    let base = (passed as i128) * pr.price_per_unit;
    let d = calc_discount_bps(&pr.tiers, passed);
    if d > 0 { base - (base * d / 10_000) } else { base }
}
fn ensure_oracle_fresh(_env: &Env, oc: &OracleConfig) {
    if !oc.enabled { return; }
}

// deterministic sampling: produce up to sample_size indices in [0, n)
fn deterministic_sample(env: &Env, n: u32, sample_size: u32, seed: &BytesN<32>) -> Vec<u32> {
    let mut out: Vec<u32> = Vec::new(env);
    if n == 0 || sample_size == 0 { return out; }
    let mut i: u32 = 0;
    while out.len() < sample_size && i < sample_size * 4 {
        // simple hash mixing: take seed[ (i mod 32) ] and ledger timestamp
        let b = seed.get((i % 32) as usize);
        let mixed = ((b as u64) + env.ledger().timestamp() + (i as u64) * 1103515245) as u64;
        let idx = (mixed % (n as u64)) as u32;
        if !out.contains(idx) { out.push_back(idx); }
        i += 1;
    }
    out
}

// =========================== Contract ===========================
#[contract]
pub struct Fairfoundry;

#[contractimpl]
impl Fairfoundry {
    // --------------------------- init ---------------------------
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
        min_qa_stake: i128,
        oem_bond: i128,
        dispute_window_secs: u64,
    ) {
        oem.require_auth(); factory.require_auth(); qa.require_auth();
        if pricing.price_per_unit <= 0 || min_qa_stake < 0 || oem_bond < 0 {
            panic_with_error!(&env, Err::Param);
        }
        let st = State {
            roles: Roles { oem, factory, qa },
            pay_asset, pricing, ers, oracle,
            min_escrow_lots, escrow_balance: 0,
            min_qa_stake, qa_stake: 0,
            oem_bond,
            dispute_window_secs,
            paused: false,
            total_units_produced: 0,
            total_units_approved: 0,
            ers_pending: None,
            pricing_pending: None,
            roles_pending: None,
            upgrade_pending: None,
            entered: false,
        };
        env.storage().persistent().set(&S, &st);
        env.storage().persistent().set(&LOTS, &Map::<String,Lot>::new(&env));
        env.storage().persistent().set(&CHAL, &Map::<String,Challenge>::new(&env));
        log!(&env, "ff:init");
    }

    // --------------------- Escrow / Stake / Bond ----------------
    pub fn deposit_escrow(env: Env, from: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &from, &st.roles);
        if from != st.roles.oem { panic_with_error!(&env, Err::NotAuthorized); }
        enter(&env, &mut st);
        let c = st.pay_asset.client(&env);
        c.transfer(&from, &env.current_contract_address(), &amount);
        st.escrow_balance += amount;
        env.events().publish(("EscrowDeposited",), (from.clone(), amount));
        exit(&env, &mut st);
    }

    pub fn withdraw_escrow(env: Env, oem: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &oem, &st.roles);
        if oem != st.roles.oem { panic_with_error!(&env, Err::NotAuthorized); }
        if amount > st.escrow_balance { panic_with_error!(&env, Err::InsufficientEscrow); }
        enter(&env, &mut st);
        st.escrow_balance -= amount;
        let c = st.pay_asset.client(&env);
        c.transfer(&env.current_contract_address(), &oem, &amount);
        env.events().publish(("EscrowWithdrawn",), (oem, amount));
        exit(&env, &mut st);
    }

    pub fn stake_qa(env: Env, qa: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        if qa != st.roles.qa { panic_with_error!(&env, Err::NotAuthorized); }
        enter(&env, &mut st);
        let c = st.pay_asset.client(&env);
        c.transfer(&qa, &env.current_contract_address(), &amount);
        st.qa_stake += amount;
        env.events().publish(("QAStaked",), (qa, amount));
        exit(&env, &mut st);
    }

    // --------------------------- Lots ---------------------------
    pub fn create_lot(env: Env, factory: Address, lot_id: String, quantity: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &factory, &st.roles);
        if factory != st.roles.factory { panic_with_error!(&env, Err::NotAuthorized); }
        if quantity == 0 { panic_with_error!(&env, Err::Param); }
        if st.qa_stake < st.min_qa_stake { panic_with_error!(&env, Err::InvalidState); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        if lots.contains_key(lot_id.clone()) { panic_with_error!(&env, Err::AlreadyExists); }

        let required_per_lot = (st.pricing.price_per_unit as i128) * (quantity as i128);
        let min_required = required_per_lot * (st.min_escrow_lots as i128);
        if st.escrow_balance < min_required { panic_with_error!(&env, Err::InsufficientEscrow); }

        let lot = Lot {
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

        let meta = QAMetadata{
            commit_root,
            report_uri,
            serials_root: None,
            serials_count: 0,
            bench: None,
        };
        lot.qa_commit = Some(meta);
        lot.status = LotStatus::InQA;
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        env.events().publish(("QACommitted",), (lot_id,));
    }

    // NEW: bind serials (Merkle root) and count
    pub fn qa_commit_serials(env: Env, qa: Address, lot_id: String, serials_root: BytesN<32>, serials_count: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        if qa != st.roles.qa { panic_with_error!(&env, Err::NotAuthorized); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        let mut meta = lot.qa_commit.clone().unwrap_or_else(|| panic_with_error!(&env, Err::InvalidState));

        meta.serials_root = Some(serials_root);
        meta.serials_count = serials_count;
        lot.qa_commit = Some(meta);
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        env.events().publish(("SerialsCommitted",), (lot_id, serials_count));
    }

    // NEW: record testbench attestation
    pub fn qa_commit_attestation(env: Env, qa: Address, lot_id: String, bench_id: String, firmware_hash: BytesN<32>, signer: Address) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        if qa != st.roles.qa { panic_with_error!(&env, Err::NotAuthorized); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        let mut meta = lot.qa_commit.clone().unwrap_or_else(|| panic_with_error!(&env, Err::InvalidState));

        let att = TestbenchAttestation { bench_id, firmware_hash, signer };
        meta.bench = Some(att);
        lot.qa_commit = Some(meta);
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        env.events().publish(("AttestationCommitted",), (lot_id,));
    }

    pub fn qa_update_counts(env: Env, qa: Address, lot_id: String, tested: u32, passed: u32, failed: u32) {
        let st: State = env.storage().persistent().get(&S).unwrap();
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

    // ------------------------ Re-inspection --------------------------
    // Anyone in roles can request re-inspection sampling for a lot with committed serials.
    // Returns the vector of indices to be re-inspected and stores a Challenge with a deadline.
    pub fn request_reinspect(env: Env, requester: Address, lot_id: String, sample_size: u32, response_deadline_secs: u64, seed: BytesN<32>) -> Vec<u32> {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &requester, &st.roles);

        let lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        let meta = lot.qa_commit.clone().unwrap_or_else(|| panic_with_error!(&env, Err::InvalidState));
        let n = meta.serials_count;
        if n == 0 || meta.serials_root.is_none() { panic_with_error!(&env, Err::Param); }

        // sample
        let indices = deterministic_sample(&env, n, sample_size, &seed);

        let mut chal_map: Map<String,Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        let ch = Challenge {
            requested_by: requester.clone(),
            seed,
            sample_size,
            sample_indices: indices.clone(),
            requested_at: now(&env),
            due_by: now(&env) + response_deadline_secs,
            status: ChallengeStatus::Open,
        };
        chal_map.set(lot_id.clone(), ch);
        env.storage().persistent().set(&CHAL, &chal_map);
        env.events().publish(("ReinspectRequested",), (lot_id.clone(), sample_size, response_deadline_secs));

        indices
    }

    // QA responds; in a full implementation we would verify inclusion proofs. Here we mark responded.
    pub fn qa_reinspect_respond(env: Env, qa: Address, lot_id: String, pass_count: u32, fail_count: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        if qa != st.roles.qa { panic_with_error!(&env, Err::NotAuthorized); }

        let mut chal_map: Map<String,Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        let mut ch = chal_map.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NoChallenge));
        if ch.status != ChallengeStatus::Open { panic_with_error!(&env, Err::InvalidState); }
        ch.status = ChallengeStatus::Responded;
        chal_map.set(lot_id.clone(), ch);
        env.storage().persistent().set(&CHAL, &chal_map);
        env.events().publish(("ReinspectResponded",), (lot_id, pass_count, fail_count));
    }

    // After due_by, if QA hasn't responded, allow any other party to slash QA stake and pause system or mark lot disputed.
    pub fn challenge_default_slash(env: Env, caller: Address, lot_id: String, slash_bps: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);

        let mut chal_map: Map<String,Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        let mut ch = chal_map.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NoChallenge));
        if ch.status != ChallengeStatus::Open { panic_with_error!(&env, Err::InvalidState); }
        if now(&env) <= ch.due_by { panic_with_error!(&env, Err::TooEarlyOrLate); }

        // slash QA stake proportionally
        let slash = (st.qa_stake * (slash_bps as i128)) / 10_000;
        if slash > 0 && st.qa_stake >= slash {
            let c = st.pay_asset.client(&env);
            // send slash to OEM as default beneficiary
            c.transfer(&env.current_contract_address(), &st.roles.oem, &slash);
            st.qa_stake -= slash;
        }
        ch.status = ChallengeStatus::Expired;
        chal_map.set(lot_id.clone(), ch);
        env.storage().persistent().set(&CHAL, &chal_map);
        env.storage().persistent().set(&S, &st);
        env.events().publish(("ReinspectDefaultSlashed",), (lot_id, slash_bps));
    }

    // ------------------------ Disputes --------------------------
    pub fn dispute_open(env: Env, oem: Address, lot_id: String) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &oem, &st.roles);
        if oem != st.roles.oem { panic_with_error!(&env, Err::NotAuthorized); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if lot.status != LotStatus::Approved { panic_with_error!(&env, Err::InvalidState); }

        if now(&env) > lot.last_update + st.dispute_window_secs {
            panic_with_error!(&env, Err::TooEarlyOrLate);
        }

        lot.status = LotStatus::Disputed;
        lot.last_update = now(&env);
        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        env.events().publish(("LotDisputed",), (lot_id,));
    }

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

        if a.len() < 2 { return; } // wait quorum

        let c = st.pay_asset.client(&env);
        let base = compute_price_for_lot(&st.pricing, lot.passed);
        let penalty = (base * (penalty_bps as i128))/10_000;

        if pay_factory {
            let pay = base - penalty;
            if pay > 0 {
                c.transfer(&env.current_contract_address(), &st.roles.factory, &pay);
                st.escrow_balance -= pay;
            }
            if st.oem_bond > 0 {
                let slash = core::cmp::min(st.oem_bond, penalty as i128);
                if slash > 0 {
                    c.transfer(&env.current_contract_address(), &st.roles.factory, &slash);
                    st.escrow_balance -= slash;
                }
            }
            lot.status = LotStatus::Paid;
        } else {
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

    // -------------------- Partial / Final Pay -------------------
    pub fn partial_payout(env: Env, caller: Address, lot_id: String, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);
        require_not_paused(&env, &st);
        if st.qa_stake < st.min_qa_stake { panic_with_error!(&env, Err::InvalidState); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if lot.status != LotStatus::InQA && lot.status != LotStatus::Approved { panic_with_error!(&env, Err::InvalidState); }

        let cap = compute_price_for_lot(&st.pricing, lot.passed) - lot.partial_paid_amount;
        if amount <= 0 || amount > cap { panic_with_error!(&env, Err::Param); }

        enter(&env, &mut st);
        let c = st.pay_asset.client(&env);
        c.transfer(&env.current_contract_address(), &st.roles.factory, &amount);
        st.escrow_balance -= amount;
        lot.partial_paid_amount += amount;
        lot.last_update = now(&env);
        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        exit(&env, &mut st);

        env.events().publish(("LotPartialPaid",), (lot_id, amount));
    }

    pub fn execute_payment(env: Env, lot_id: String) -> i128 {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        if st.qa_stake < st.min_qa_stake { panic_with_error!(&env, Err::InvalidState); }
        if let Some(oc) = &st.oracle { ensure_oracle_fresh(&env, oc); }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone()).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if lot.status != LotStatus::Approved { panic_with_error!(&env, Err::InvalidState); }

        let mut payment = compute_price_for_lot(&st.pricing, lot.passed);
        let defect_bps = if lot.tested > 0 { (lot.failed as i128)*10_000 / (lot.tested as i128) } else { 0 };
        if defect_bps > (st.ers.max_defect_bps as i128) {
            payment -= (payment * (st.pricing.defect_penalty_bps as i128)) / 10_000;
        }
        if lot.partial_paid_amount > 0 { payment -= lot.partial_paid_amount; }

        if payment <= 0 {
            lot.status = LotStatus::Closed;
            lot.pay_nonce += 1;
            lot.last_update = now(&env);
            lots.set(lot_id.clone(), lot);
            env.storage().persistent().set(&LOTS, &lots);
            return 0;
        }

        enter(&env, &mut st);
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
        exit(&env, &mut st);

        env.events().publish(("LotPaid",), (lot_id, payment));
        payment
    }

    // ---------------------- Governance (ERS/Pricing/Roles) ----------------------
    pub fn propose_ers(env: Env, caller: Address, ers: ERS, delay_secs: u64) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);
        let tl = Timelock { eta: now(&env)+delay_secs, approvals: vec![&env, caller], executed: false };
        st.ers_pending = Some(PendingUpdate { payload: ers, requested_at: now(&env), timelock: tl });
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
        let mut new = p.payload; new.version = st.ers.version + 1;
        st.ers = new; p.timelock.executed = true; st.ers_pending = None;
        env.storage().persistent().set(&S, &st);
        env.events().publish(("ERSUpdated",), (st.ers.version,));
    }

    pub fn propose_pricing(env: Env, caller: Address, pricing: Pricing, delay_secs: u64) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);
        if pricing.price_per_unit <= 0 { panic_with_error!(&env, Err::Param); }
        let tl = Timelock{ eta: now(&env)+delay_secs, approvals: vec![&env, caller], executed: false };
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
        st.pricing = p.payload; p.timelock.executed = true; st.pricing_pending = None;
        env.storage().persistent().set(&S, &st);
        env.events().publish(("PricingUpdated",), ());
    }

    pub fn propose_roles(env: Env, caller: Address, roles: Roles, delay_secs: u64) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);
        let tl = Timelock{ eta: now(&env)+delay_secs, approvals: vec![&env, caller], executed: false };
        st.roles_pending = Some(PendingUpdate{ payload: roles, requested_at: now(&env), timelock: tl });
        env.storage().persistent().set(&S, &st);
    }
    pub fn approve_roles(env: Env, approver: Address) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &approver, &st.roles);
        let mut p = st.roles_pending.clone().unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if !p.timelock.approvals.contains(approver.clone()) { p.timelock.approvals.push_back(approver); }
        st.roles_pending = Some(p);
        env.storage().persistent().set(&S, &st);
    }
    pub fn execute_roles(env: Env) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        let mut p = st.roles_pending.clone().unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        if p.timelock.executed { panic_with_error!(&env, Err::AlreadyExecuted); }
        if !quorum_ok(&p.timelock.approvals) { panic_with_error!(&env, Err::NotAuthorized); }
        if now(&env) < p.timelock.eta { panic_with_error!(&env, Err::TimelockActive); }
        st.roles = p.payload; p.timelock.executed = true; st.roles_pending = None;
        env.storage().persistent().set(&S, &st);
    }

    // ------------------------ Pause / Unpause -------------------
    pub fn pause(env: Env, a: Address, b: Address) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &a, &st.roles); require_party(&env, &b, &st.roles);
        if a == b { panic_with_error!(&env, Err::NotAuthorized); }
        st.paused = true; env.storage().persistent().set(&S, &st);
        env.events().publish(("Paused",), ());
    }
    pub fn unpause(env: Env, a: Address, b: Address) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &a, &st.roles); require_party(&env, &b, &st.roles);
        if a == b { panic_with_error!(&env, Err::NotAuthorized); }
        st.paused = false; env.storage().persistent().set(&S, &st);
        env.events().publish(("Unpaused",), ());
    }

    // ------------------------- Views & Analytics ----------------
    pub fn view_state(env: Env) -> State { env.storage().persistent().get(&S).unwrap() }
    pub fn view_lot(env: Env, lot_id: String) -> Lot {
        let lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        lots.get(lot_id).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound))
    }
    pub fn view_lot_counts(env: Env) -> (u32,u32,u32,u32,u32,u32,u32) {
        let lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut open=0; let mut inqa=0; let mut approved=0; let mut disputed=0; let mut paid=0; let mut refunded=0; let mut closed=0;
        for (_k, v) in lots.iter() {
            match v.status {
                LotStatus::Open => open+=1,
                LotStatus::InQA => inqa+=1,
                LotStatus::Approved => approved+=1,
                LotStatus::Disputed => disputed+=1,
                LotStatus::Paid => paid+=1,
                LotStatus::Refunded => refunded+=1,
                LotStatus::Closed => closed+=1,
            }
        }
        (open, inqa, approved, disputed, paid, refunded, closed)
    }
    pub fn view_defect_stats(env: Env) -> (u64,u64,u64) {
        let lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut tested: u64 = 0; let mut failed: u64 = 0;
        for (_k, v) in lots.iter() {
            tested += v.tested as u64;
            failed += v.failed as u64;
        }
        let bps = if tested > 0 { (failed * 10_000) / tested } else { 0 };
        (tested, failed, bps)
    }
}
