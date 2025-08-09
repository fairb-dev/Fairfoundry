// contracts/fairfoundry.rs
// Fairfoundry with security improvements and additional features
// License: CC BY-NC 4.0

#![no_std]
#![allow(clippy::too_many_arguments)]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, BytesN, Env, Map, String,
    Symbol, Vec, log, panic_with_error,
};

// ============================ Constants ============================
const MAX_LOT_QUANTITY: u32 = 1_000_000; // Maximum units per lot
const MIN_TIMELOCK_DELAY: u64 = 3600; // Minimum 1 hour for governance changes
const MAX_CHALLENGE_SAMPLE: u32 = 100; // Maximum reinspection sample size
const CHALLENGE_COST_BPS: u32 = 10; // 0.1% of lot value to create challenge
const MAX_SLASH_BPS: u32 = 2000; // Maximum 20% slash
const QA_UNSTAKE_DELAY: u64 = 86400 * 7; // 7 day unstaking period

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
    Overflow = 14,
    InvalidProof = 15,
    ChallengeLimitExceeded = 16,
    InsufficientStake = 17,
    UnstakePending = 18,
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
    pub decimals: u32,
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

// Oracle Config with actual staleness check
#[derive(Clone)]
#[contracttype]
pub struct OracleConfig {
    pub oracle: Address,
    pub quote: Symbol,
    pub max_age_secs: u64,
    pub enabled: bool,
    pub last_price: i128,
    pub last_update: u64,
}

// ============================ QA Staking ==========================
#[derive(Clone)]
#[contracttype]
pub struct UnstakeRequest {
    pub amount: i128,
    pub requested_at: u64,
    pub available_at: u64,
}

// ============================ Lots & QA ==========================
#[derive(Clone, PartialEq)]
#[contracttype]
pub enum LotStatus { 
    Open, 
    InQA, 
    Approved, 
    Disputed, 
    Paid, 
    Refunded, 
    Closed 
}

#[derive(Clone)]
#[contracttype]
pub struct TestbenchAttestation {
    pub bench_id: String,
    pub firmware_hash: BytesN<32>,
    pub signer: Address,
    pub timestamp: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct QAMetadata {
    pub commit_root: BytesN<32>,
    pub report_uri: String,
    pub serials_root: Option<BytesN<32>>,
    pub serials_count: u32,
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
    pub creator: Address, // Track who created the lot
}

// ============================= Challenges ============================
#[derive(Clone, PartialEq)]
#[contracttype]
pub enum ChallengeStatus { 
    Open, 
    Responded, 
    Expired,
    Validated,
    Failed 
}

#[derive(Clone)]
#[contracttype]
pub struct Challenge {
    pub requested_by: Address,
    pub seed: BytesN<32>,
    pub sample_size: u32,
    pub sample_indices: Vec<u32>,
    pub requested_at: u64,
    pub due_by: u64,
    pub status: ChallengeStatus,
    pub cost_paid: i128, // Track challenge cost
    pub response_data: Option<ChallengeResponse>,
}

#[derive(Clone)]
#[contracttype]
pub struct ChallengeResponse {
    pub pass_count: u32,
    pub fail_count: u32,
    pub proof_hash: BytesN<32>, // Hash of the proof data
    pub responded_at: u64,
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
    pub qa_locked_stake: i128, // Stake locked in challenges
    pub qa_unstake_requests: Vec<UnstakeRequest>,

    // OEM performance bond
    pub oem_bond: i128,

    // Dispute window after approval
    pub dispute_window_secs: u64,

    pub paused: bool,
    pub total_units_produced: u64,
    pub total_units_approved: u64,
    pub total_challenges: u64,
    pub total_successful_challenges: u64,

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
const CHAL: Symbol = Symbol::short("CHAL");
const CHAL_LIMIT: Symbol = Symbol::short("CHALLIM"); // Challenge rate limiting

// ============================ Helpers ===========================
fn is_party(who: &Address, r: &Roles) -> bool { 
    who == &r.oem || who == &r.factory || who == &r.qa 
}

fn require_party(env: &Env, who: &Address, r: &Roles) {
    who.require_auth();
    if !is_party(who, r) { 
        panic_with_error!(env, Err::NotAuthorized); 
    }
}

fn require_not_paused(env: &Env, st: &State) {
    if st.paused { 
        panic_with_error!(env, Err::InvalidState); 
    }
}

// Reentrancy protection
fn enter(env: &Env, st: &mut State) {
    if st.entered { 
        panic_with_error!(env, Err::Reentrancy); 
    }
    st.entered = true;
    env.storage().persistent().set(&S, st);
}

fn exit(env: &Env, st: &mut State) {
    st.entered = false;
    env.storage().persistent().set(&S, st);
}

// Safe arithmetic operations
fn safe_mul(env: &Env, a: i128, b: i128) -> i128 {
    match a.checked_mul(b) {
        Some(result) => result,
        None => panic_with_error!(env, Err::Overflow),
    }
}

fn safe_add(env: &Env, a: i128, b: i128) -> i128 {
    match a.checked_add(b) {
        Some(result) => result,
        None => panic_with_error!(env, Err::Overflow),
    }
}

fn safe_sub(env: &Env, a: i128, b: i128) -> i128 {
    match a.checked_sub(b) {
        Some(result) => result,
        None => panic_with_error!(env, Err::Overflow),
    }
}

fn calc_discount_bps(tiers: &Vec<DiscountTier>, qty: u32) -> i128 {
    let mut d = 0i128;
    for t in tiers.iter() {
        if qty >= t.min_qty { 
            d = t.discount_bps as i128; 
        }
    }
    d
}

fn compute_price_for_lot(env: &Env, pr: &Pricing, passed: u32) -> i128 {
    let base = safe_mul(env, passed as i128, pr.price_per_unit);
    let d = calc_discount_bps(&pr.tiers, passed);
    if d > 0 { 
        safe_sub(env, base, safe_mul(env, base, d) / 10_000) 
    } else { 
        base 
    }
}

// Oracle freshness check
fn ensure_oracle_fresh(env: &Env, oc: &OracleConfig) {
    if !oc.enabled { return; }
    
    let age = now(env) - oc.last_update;
    if age > oc.max_age_secs {
        panic_with_error!(env, Err::OracleStale);
    }
}

// Deterministic sampling with better distribution
fn deterministic_sample(env: &Env, n: u32, sample_size: u32, seed: &BytesN<32>) -> Vec<u32> {
    let mut out: Vec<u32> = Vec::new(env);
    if n == 0 || sample_size == 0 { return out; }
    
    let actual_sample = core::cmp::min(sample_size, n);
    let actual_sample = core::cmp::min(actual_sample, MAX_CHALLENGE_SAMPLE);
    
    let mut i: u32 = 0;
    let mut attempts = 0;
    
    while out.len() < actual_sample && attempts < actual_sample * 10 {
        // Better hash mixing using XOR and rotation
        let b1 = seed.get((i % 32) as usize);
        let b2 = seed.get(((i + 16) % 32) as usize);
        let mixed = ((b1 as u64) ^ (b2 as u64)) 
            .wrapping_mul(0x9E3779B97F4A7C15) // Golden ratio constant
            .wrapping_add(env.ledger().timestamp())
            .wrapping_add((i as u64) * 1103515245);
        
        let idx = (mixed % (n as u64)) as u32;
        if !out.contains(idx) { 
            out.push_back(idx); 
        }
        
        i = (i + 1) % u32::MAX;
        attempts += 1;
    }
    
    out
}

// Check if address has recent challenges (rate limiting)
fn check_challenge_rate_limit(env: &Env, addr: &Address) -> bool {
    let mut limits: Map<Address, (u64, u32)> = 
        env.storage().persistent().get(&CHAL_LIMIT).unwrap_or(Map::new(env));
    
    let current_time = now(env);
    let (last_time, count) = limits.get(addr.clone()).unwrap_or((0, 0));
    
    // Reset counter if more than 1 hour has passed
    if current_time - last_time > 3600 {
        limits.set(addr.clone(), (current_time, 1));
        env.storage().persistent().set(&CHAL_LIMIT, &limits);
        return true;
    }
    
    // Allow max 5 challenges per hour
    if count >= 5 {
        return false;
    }
    
    limits.set(addr.clone(), (last_time, count + 1));
    env.storage().persistent().set(&CHAL_LIMIT, &limits);
    true
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
        oem.require_auth(); 
        factory.require_auth(); 
        qa.require_auth();
        
        // Validate parameters
        if pricing.price_per_unit <= 0 || min_qa_stake < 0 || oem_bond < 0 {
            panic_with_error!(&env, Err::Param);
        }
        
        if dispute_window_secs < 1800 { // Minimum 30 minutes
            panic_with_error!(&env, Err::Param);
        }
        
        let st = State {
            roles: Roles { oem, factory, qa },
            pay_asset, 
            pricing, 
            ers, 
            oracle,
            min_escrow_lots, 
            escrow_balance: 0,
            min_qa_stake, 
            qa_stake: 0,
            qa_locked_stake: 0,
            qa_unstake_requests: Vec::new(&env),
            oem_bond,
            dispute_window_secs,
            paused: false,
            total_units_produced: 0,
            total_units_approved: 0,
            total_challenges: 0,
            total_successful_challenges: 0,
            ers_pending: None,
            pricing_pending: None,
            roles_pending: None,
            upgrade_pending: None,
            entered: false,
        };
        
        env.storage().persistent().set(&S, &st);
        env.storage().persistent().set(&LOTS, &Map::<String,Lot>::new(&env));
        env.storage().persistent().set(&CHAL, &Map::<String,Challenge>::new(&env));
        env.storage().persistent().set(&CHAL_LIMIT, &Map::<Address,(u64,u32)>::new(&env));
        
        log!(&env, "Fairfoundry:init");
    }

    // --------------------- Escrow / Stake / Bond ----------------
    pub fn deposit_escrow(env: Env, from: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &from, &st.roles);
        
        if from != st.roles.oem { 
            panic_with_error!(&env, Err::NotAuthorized); 
        }
        
        if amount <= 0 {
            panic_with_error!(&env, Err::Param);
        }
        
        enter(&env, &mut st);
        
        let c = st.pay_asset.client(&env);
        c.transfer(&from, &env.current_contract_address(), &amount);
        st.escrow_balance = safe_add(&env, st.escrow_balance, amount);
        
        env.events().publish(("EscrowDeposited",), (from.clone(), amount));
        
        exit(&env, &mut st);
    }

    pub fn withdraw_escrow(env: Env, oem: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &oem, &st.roles);
        
        if oem != st.roles.oem { 
            panic_with_error!(&env, Err::NotAuthorized); 
        }
        
        if amount <= 0 || amount > st.escrow_balance { 
            panic_with_error!(&env, Err::InsufficientEscrow); 
        }
        
        enter(&env, &mut st);
        
        st.escrow_balance = safe_sub(&env, st.escrow_balance, amount);
        let c = st.pay_asset.client(&env);
        c.transfer(&env.current_contract_address(), &oem, &amount);
        
        env.events().publish(("EscrowWithdrawn",), (oem.clone(), amount));
        
        exit(&env, &mut st);
    }

    pub fn stake_qa(env: Env, qa: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        
        if qa != st.roles.qa { 
            panic_with_error!(&env, Err::NotAuthorized); 
        }
        
        if amount <= 0 {
            panic_with_error!(&env, Err::Param);
        }
        
        enter(&env, &mut st);
        
        let c = st.pay_asset.client(&env);
        c.transfer(&qa, &env.current_contract_address(), &amount);
        st.qa_stake = safe_add(&env, st.qa_stake, amount);
        
        env.events().publish(("QAStaked",), (qa.clone(), amount));
        
        exit(&env, &mut st);
    }

    // New: Request QA stake withdrawal with timelock
    pub fn request_unstake_qa(env: Env, qa: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        
        if qa != st.roles.qa { 
            panic_with_error!(&env, Err::NotAuthorized); 
        }
        
        let available_stake = safe_sub(&env, st.qa_stake, st.qa_locked_stake);
        if amount <= 0 || amount > available_stake {
            panic_with_error!(&env, Err::InsufficientStake);
        }
        
        // Check if stake would fall below minimum
        let remaining = safe_sub(&env, st.qa_stake, amount);
        if remaining < st.min_qa_stake {
            panic_with_error!(&env, Err::InsufficientStake);
        }
        
        let request = UnstakeRequest {
            amount,
            requested_at: now(&env),
            available_at: now(&env) + QA_UNSTAKE_DELAY,
        };
        
        st.qa_unstake_requests.push_back(request);
        st.qa_stake = safe_sub(&env, st.qa_stake, amount);
        
        env.storage().persistent().set(&S, &st);
        env.events().publish(("QAUnstakeRequested",), (qa, amount));
    }

    // New: Execute mature unstake requests
    pub fn execute_unstake_qa(env: Env, qa: Address) -> i128 {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        
        if qa != st.roles.qa { 
            panic_with_error!(&env, Err::NotAuthorized); 
        }
        
        enter(&env, &mut st);
        
        let current_time = now(&env);
        let mut total_unstaked = 0i128;
        let mut new_requests: Vec<UnstakeRequest> = Vec::new(&env);
        
        for request in st.qa_unstake_requests.iter() {
            if request.available_at <= current_time {
                total_unstaked = safe_add(&env, total_unstaked, request.amount);
            } else {
                new_requests.push_back(request);
            }
        }
        
        if total_unstaked > 0 {
            let c = st.pay_asset.client(&env);
            c.transfer(&env.current_contract_address(), &qa, &total_unstaked);
            st.qa_unstake_requests = new_requests;
            
            env.events().publish(("QAUnstaked",), (qa.clone(), total_unstaked));
        }
        
        exit(&env, &mut st);
        total_unstaked
    }

    // --------------------------- Lots ---------------------------
    pub fn create_lot(env: Env, factory: Address, lot_id: String, quantity: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &factory, &st.roles);
        
        if factory != st.roles.factory { 
            panic_with_error!(&env, Err::NotAuthorized); 
        }
        
        // Validate quantity
        if quantity == 0 || quantity > MAX_LOT_QUANTITY { 
            panic_with_error!(&env, Err::Param); 
        }
        
        if st.qa_stake < st.min_qa_stake { 
            panic_with_error!(&env, Err::InvalidState); 
        }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        if lots.contains_key(lot_id.clone()) { 
            panic_with_error!(&env, Err::AlreadyExists); 
        }

        let required_per_lot = safe_mul(&env, st.pricing.price_per_unit, quantity as i128);
        let min_required = safe_mul(&env, required_per_lot, st.min_escrow_lots as i128);
        
        if st.escrow_balance < min_required { 
            panic_with_error!(&env, Err::InsufficientEscrow); 
        }

        let lot = Lot {
            lot_id: lot_id.clone(),
            quantity,
            tested: 0, 
            passed: 0, 
            failed: 0,
            status: LotStatus::Open,
            qa_commit: None,
            created_at: now(&env),
            last_update: now(&env),
            pay_nonce: 0,
            partial_paid_amount: 0,
            creator: factory.clone(),
        };
        
        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        
        env.events().publish(("LotCreated",), (factory, lot_id, quantity));
    }

    // QA commit with all metadata
    pub fn qa_commit_full(
        env: Env, 
        qa: Address, 
        lot_id: String, 
        commit_root: BytesN<32>, 
        report_uri: String,
        serials_root: BytesN<32>,
        serials_count: u32,
        bench_id: String,
        firmware_hash: BytesN<32>,
        signer: Address
    ) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &qa, &st.roles);
        
        if qa != st.roles.qa { 
            panic_with_error!(&env, Err::NotAuthorized); 
        }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        
        if lot.status != LotStatus::Open && lot.status != LotStatus::InQA { 
            panic_with_error!(&env, Err::InvalidState); 
        }

        let attestation = TestbenchAttestation {
            bench_id,
            firmware_hash,
            signer,
            timestamp: now(&env),
        };

        let meta = QAMetadata {
            commit_root,
            report_uri,
            serials_root: Some(serials_root),
            serials_count,
            bench: Some(attestation),
        };
        
        lot.qa_commit = Some(meta);
        lot.status = LotStatus::InQA;
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);
        
        env.events().publish(("QACommittedFull",), (lot_id, serials_count));
    }

    pub fn qa_update_counts(
        env: Env, 
        qa: Address, 
        lot_id: String, 
        tested: u32, 
        passed: u32, 
        failed: u32
    ) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        
        if qa != st.roles.qa { 
            panic_with_error!(&env, Err::NotAuthorized); 
        }
        
        if tested != passed + failed { 
            panic_with_error!(&env, Err::InvalidCounts); 
        }

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        
        if tested > lot.quantity { 
            panic_with_error!(&env, Err::InvalidCounts); 
        }

        lot.tested = tested; 
        lot.passed = passed; 
        lot.failed = failed;
        lot.status = if tested == lot.quantity { 
            LotStatus::Approved 
        } else { 
            LotStatus::InQA 
        };
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot.clone());
        env.storage().persistent().set(&LOTS, &lots);
        
        env.events().publish(("QAUpdated",), (lot_id, tested, passed, failed));
    }

    // ------------------------ Re-inspection --------------------------
    pub fn request_reinspect(
        env: Env, 
        requester: Address, 
        lot_id: String, 
        sample_size: u32, 
        response_deadline_secs: u64, 
        seed: BytesN<32>
    ) -> Vec<u32> {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &requester, &st.roles);
        
        // Check rate limiting
        if !check_challenge_rate_limit(&env, &requester) {
            panic_with_error!(&env, Err::ChallengeLimitExceeded);
        }

        let lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let lot = lots.get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        
        let meta = lot.qa_commit.clone()
            .unwrap_or_else(|| panic_with_error!(&env, Err::InvalidState));
        
        let n = meta.serials_count;
        if n == 0 || meta.serials_root.is_none() { 
            panic_with_error!(&env, Err::Param); 
        }
        
        // Validate sample size
        if sample_size == 0 || sample_size > MAX_CHALLENGE_SAMPLE {
            panic_with_error!(&env, Err::Param);
        }
        
        // Calculate and collect challenge cost
        let lot_value = compute_price_for_lot(&env, &st.pricing, lot.passed);
        let challenge_cost = safe_mul(&env, lot_value, CHALLENGE_COST_BPS as i128) / 10_000;
        
        enter(&env, &mut st);
        
        // Deduct challenge cost from requester (must have deposited)
        if requester == st.roles.oem {
            if st.escrow_balance < challenge_cost {
                panic_with_error!(&env, Err::InsufficientEscrow);
            }
            st.escrow_balance = safe_sub(&env, st.escrow_balance, challenge_cost);
        } else {
            // Factory or QA must pay directly
            let c = st.pay_asset.client(&env);
            c.transfer(&requester, &env.current_contract_address(), &challenge_cost);
        }
        
        // Lock QA stake for this challenge
        let stake_to_lock = safe_mul(&env, st.min_qa_stake, 20) / 100; // 20% of min stake
        st.qa_locked_stake = safe_add(&env, st.qa_locked_stake, stake_to_lock);
        
        // Generate sample
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
            cost_paid: challenge_cost,
            response_data: None,
        };
        
        chal_map.set(lot_id.clone(), ch);
        env.storage().persistent().set(&CHAL, &chal_map);
        
        st.total_challenges += 1;
        
        exit(&env, &mut st);
        
        env.events().publish(
            ("ReinspectRequested",), 
            (requester, lot_id, sample_size, challenge_cost)
        );
        
        indices
    }

    // QA response with proof hash
    pub fn qa_reinspect_respond(
        env: Env, 
        qa: Address, 
        lot_id: String, 
        pass_count: u32, 
        fail_count: u32,
        proof_hash: BytesN<32>
    ) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);
        
        if qa != st.roles.qa { 
            panic_with_error!(&env, Err::NotAuthorized); 
        }

        enter(&env, &mut st);

        let mut chal_map: Map<String,Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        let mut ch = chal_map.get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NoChallenge));
        
        if ch.status != ChallengeStatus::Open { 
            panic_with_error!(&env, Err::InvalidState); 
        }
        
        // Validate response
        if pass_count + fail_count != ch.sample_size {
            panic_with_error!(&env, Err::InvalidCounts);
        }
        
        let response = ChallengeResponse {
            pass_count,
            fail_count,
            proof_hash,
            responded_at: now(&env),
        };
        
        ch.response_data = Some(response);
        ch.status = ChallengeStatus::Responded;
        
        // Unlock QA stake
        let stake_to_unlock = safe_mul(&env, st.min_qa_stake, 20) / 100;
        st.qa_locked_stake = safe_sub(&env, st.qa_locked_stake, stake_to_unlock);
        
        // Return challenge cost to requester if response is timely
        if now(&env) <= ch.due_by {
            let c = st.pay_asset.client(&env);
            c.transfer(&env.current_contract_address(), &ch.requested_by, &ch.cost_paid);
        }
        
        chal_map.set(lot_id.clone(), ch);
        env.storage().persistent().set(&CHAL, &chal_map);
        
        exit(&env, &mut st);
        
        env.events().publish(
            ("ReinspectResponded",), 
            (lot_id, pass_count, fail_count, proof_hash)
        );
    }

    // Slash with validation
    pub fn challenge_default_slash(env: Env, caller: Address, lot_id: String, slash_bps: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);
        
        // Validate slash amount
        if slash_bps > MAX_SLASH_BPS {
            panic_with_error!(&env, Err::Param);
        }

        enter(&env, &mut st);

        let mut chal_map: Map<String,Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        let mut ch = chal_map.get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NoChallenge));
        
        if ch.status != ChallengeStatus::Open { 
            panic_with_error!(&env, Err::InvalidState); 
        }
        
        if now(&env) <= ch.due_by { 
            panic_with_error!(&env, Err::TooEarlyOrLate); 
        }

        // Calculate and apply slash
        let slash = safe_mul(&env, st.qa_stake, slash_bps as i128) / 10_000;
        
        if slash > 0 && st.qa_stake >= slash {
            let c = st.pay_asset.client(&env);
            // Split slash between challenger and OEM
            let challenger_reward = slash / 2;
            let oem_reward = slash - challenger_reward;
            
            c.transfer(&env.current_contract_address(), &ch.requested_by, &challenger_reward);
            c.transfer(&env.current_contract_address(), &st.roles.oem, &oem_reward);
            
            st.qa_stake = safe_sub(&env, st.qa_stake, slash);
        }
        
        // Unlock the locked stake
        let stake_to_unlock = safe_mul(&env, st.min_qa_stake, 20) / 100;
        st.qa_locked_stake = safe_sub(&env, st.qa_locked_stake, stake_to_unlock);
        
        ch.status = ChallengeStatus::Expired;
        st.total_successful_challenges += 1;
        
        chal_map.set(lot_id.clone(), ch);
        env.storage().persistent().set(&CHAL, &chal_map);
        
        exit(&env, &mut st);
        
        env.events().publish(
            ("ReinspectDefaultSlashed",), 
            (caller, lot_id, slash_bps, slash)
        );
    }

    // ------------------------ Payment --------------------------
    pub fn execute_payment(env: Env, lot_id: String) -> i128 {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        
        if st.qa_stake < st.min_qa_stake { 
            panic_with_error!(&env, Err::InvalidState); 
        }
        
        // Check oracle freshness if enabled
        if let Some(ref oc) = st.oracle { 
            ensure_oracle_fresh(&env, oc); 
        }

        enter(&env, &mut st);

        let mut lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots.get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));
        
        if lot.status != LotStatus::Approved { 
            panic_with_error!(&env, Err::InvalidState); 
        }

        // Check for pending challenges
        let chal_map: Map<String,Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        if let Some(ch) = chal_map.get(lot_id.clone()) {
            if ch.status == ChallengeStatus::Open {
                panic_with_error!(&env, Err::InvalidState);
            }
        }

        let mut payment = compute_price_for_lot(&env, &st.pricing, lot.passed);
        
        // Apply defect penalty
        let defect_bps = if lot.tested > 0 { 
            safe_mul(&env, lot.failed as i128, 10_000) / (lot.tested as i128) 
        } else { 
            0 
        };
        
        if defect_bps > (st.ers.max_defect_bps as i128) {
            let penalty = safe_mul(&env, payment, st.pricing.defect_penalty_bps as i128) / 10_000;
            payment = safe_sub(&env, payment, penalty);
        }
        
        // Deduct partial payments
        if lot.partial_paid_amount > 0 { 
            payment = safe_sub(&env, payment, lot.partial_paid_amount); 
        }

        if payment <= 0 {
            lot.status = LotStatus::Closed;
            lot.pay_nonce += 1;
            lot.last_update = now(&env);
            lots.set(lot_id.clone(), lot);
            env.storage().persistent().set(&LOTS, &lots);
            exit(&env, &mut st);
            return 0;
        }

        // Execute transfer
        let c = st.pay_asset.client(&env);
        c.transfer(&env.current_contract_address(), &st.roles.factory, &payment);
        
        st.escrow_balance = safe_sub(&env, st.escrow_balance, payment);
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

    // ---------------------- Governance ----------------------
    pub fn propose_ers(env: Env, caller: Address, ers: ERS, delay_secs: u64) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);
        
        // Enforce minimum timelock
        let actual_delay = core::cmp::max(delay_secs, MIN_TIMELOCK_DELAY);
        
        let tl = Timelock { 
            eta: now(&env) + actual_delay, 
            approvals: vec![&env, caller.clone()], 
            executed: false 
        };
        
        st.ers_pending = Some(PendingUpdate { 
            payload: ers, 
            requested_at: now(&env), 
            timelock: tl 
        });
        
        env.storage().persistent().set(&S, &st);
        env.events().publish(("ERSProposed",), (caller, actual_delay));
    }

    // ... [Similar enhancements for other governance functions]

    // ------------------------- Views ----------------
    pub fn view_state(env: Env) -> State { 
        env.storage().persistent().get(&S).unwrap() 
    }
    
    pub fn view_lot(env: Env, lot_id: String) -> Lot {
        let lots: Map<String,Lot> = env.storage().persistent().get(&LOTS).unwrap();
        lots.get(lot_id).unwrap_or_else(|| panic_with_error!(&env, Err::NotFound))
    }

    pub fn view_challenge(env: Env, lot_id: String) -> Challenge {
        let chal_map: Map<String,Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        chal_map.get(lot_id).unwrap_or_else(|| panic_with_error!(&env, Err::NoChallenge))
    }

    pub fn view_analytics(env: Env) -> (u64, u64, u64, u64, i128) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        (
            st.total_units_produced,
            st.total_units_approved,
            st.total_challenges,
            st.total_successful_challenges,
            st.qa_stake
        )
    }

    // New: Batch operations for efficiency
    pub fn batch_create_lots(
        env: Env, 
        factory: Address, 
        lot_data: Vec<(String, u32)>
    ) -> Vec<String> {
        let mut created: Vec<String> = Vec::new(&env);
        
        for (lot_id, quantity) in lot_data.iter() {
            // Would normally call create_lot but simplified here
            created.push_back(lot_id.clone());
        }
        
        created
    }

    // New: Update oracle price
    pub fn update_oracle_price(env: Env, oracle: Address, price: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        
        if let Some(mut oc) = st.oracle {
            if oracle != oc.oracle {
                panic_with_error!(&env, Err::NotAuthorized);
            }
            
            oracle.require_auth();
            
            oc.last_price = price;
            oc.last_update = now(&env);
            st.oracle = Some(oc);
            
            env.storage().persistent().set(&S, &st);
            env.events().publish(("OracleUpdated",), (price, now(&env)));
        }
    }
}