//! # Fairfoundry — Escrowed Manufacturing Settlements with QA & Challenges
//!
//! A Soroban smart contract for managing escrowed manufacturing settlements between
//! three parties: **OEM** (buyer), **Factory** (manufacturer), and **QA** (quality assurance).
//!
//! ## Three Roles
//!
//! - **OEM**: Deposits escrow, settles payment to factory, co-beneficiary of QA slashing.
//! - **Factory**: Creates production lots, receives settlement after QA approval.
//! - **QA**: Stakes collateral, commits testing metadata and pass/fail counts. May be
//!   slashed for missed reinspection deadlines.
//!
//! ## Lot Lifecycle
//!
//! ```text
//! Open -> InQA      (qa_commit / qa_commit_full)
//!      -> Approved   (qa_update_counts when tested == quantity)
//!      -> Paid       (execute_payment)
//!      -> Closed     (execute_payment when payment <= 0)
//! ```
//!
//! Optional challenge/reinspection can be requested at any point after QA commits.
//!
//! See the [README](../../../README.md) for full documentation.

#![no_std]
#![allow(clippy::too_many_arguments)]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, log, panic_with_error, symbol_short,
    token, Address, BytesN, Env, Map, String, Symbol, Vec,
};

// ============================ Constants ============================

/// Maximum number of units a single lot may contain.
const MAX_LOT_QUANTITY: u32 = 1_000_000;

/// Minimum delay (in seconds) for governance timelock proposals.
const MIN_TIMELOCK_DELAY: u64 = 3600;

/// Maximum number of units that can be sampled in a reinspection challenge.
const MAX_CHALLENGE_SAMPLE: u32 = 100;

/// Challenge cost expressed in basis points of the lot value (0.1%).
const CHALLENGE_COST_BPS: u32 = 10;

/// Maximum slash percentage (in basis points) that can be applied to QA stake (20%).
const MAX_SLASH_BPS: u32 = 2000;

/// Delay (in seconds) before a QA unstake request can be executed (7 days).
const QA_UNSTAKE_DELAY: u64 = 86400 * 7;

// ============================ Errors ============================

/// Contract error codes. Each variant maps to a numeric Soroban error code.
#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Err {
    /// Caller does not hold the required role (OEM, Factory, or QA) or failed `require_auth`.
    /// Thrown by every role-gated mutator.
    NotAuthorized = 1,

    /// Operation attempted in a state that does not permit it. Thrown when:
    /// the contract is paused, a lot is not in the expected status, QA stake is below
    /// minimum, or an open challenge blocks payment.
    InvalidState = 2,

    /// Escrow balance is insufficient for the requested operation. Thrown by
    /// `withdraw_escrow`, `create_lot` (funding check), and `request_reinspect` (fee).
    InsufficientEscrow = 3,

    /// Test counts are invalid: `tested != passed + failed` or `tested > quantity`.
    /// Thrown by `qa_update_counts` and `qa_reinspect_respond`.
    InvalidCounts = 4,

    /// Referenced lot or challenge does not exist in storage.
    NotFound = 5,

    /// A lot with the given ID already exists. Thrown by `create_lot`.
    AlreadyExists = 6,

    /// A governance timelock is still active; cannot apply or override.
    TimelockActive = 7,

    /// The governance proposal has already been executed.
    AlreadyExecuted = 8,

    /// Oracle price data is older than `max_age_secs`. Thrown by `execute_payment`.
    OracleStale = 9,

    /// Generic parameter validation failure (zero amounts, out-of-range quantities, etc.).
    Param = 10,

    /// Attempted to slash before the challenge deadline has passed.
    /// Thrown by `challenge_default_slash`.
    TooEarlyOrLate = 11,

    /// Reentrancy guard triggered — a nested call attempted state mutation.
    Reentrancy = 12,

    /// No challenge exists for the given lot. Thrown by `qa_reinspect_respond`
    /// and `challenge_default_slash`.
    NoChallenge = 13,

    /// Arithmetic overflow in safe math operations.
    Overflow = 14,

    /// Reserved for future use: invalid Merkle proof verification.
    InvalidProof = 15, // TODO: wire to Merkle-proof verification when implemented

    /// Address has exceeded the per-hour challenge rate limit (max 5/hour).
    /// Thrown by `request_reinspect`.
    ChallengeLimitExceeded = 16,

    /// QA stake is insufficient or would drop below `min_qa_stake`.
    /// Thrown by `request_unstake_qa`.
    InsufficientStake = 17,

    /// Reserved for future use: unstake request conflicts.
    UnstakePending = 18, // TODO: enforce single-request-per-QA if needed
}

// ======================== Roles & Assets ========================

/// The three fixed roles in a Fairfoundry settlement. Set once at `init`.
#[derive(Clone)]
#[contracttype]
pub struct Roles {
    /// Original Equipment Manufacturer — funds escrow and settles payments.
    pub oem: Address,
    /// Manufacturing partner — creates lots and receives payment.
    pub factory: Address,
    /// Quality Assurance provider — stakes collateral and certifies lots.
    pub qa: Address,
}

/// Discriminant for the payment token type.
#[derive(Clone)]
#[contracttype]
pub enum AssetKind {
    /// Stellar native lumens (XLM) via the Stellar Asset Contract.
    NativeXlm,
    /// A Stellar-issued asset identified by its contract ID.
    StellarAsset(BytesN<32>),
}

/// Payment asset configuration including the token contract address and decimal precision.
/// The `kind` field is informational (useful for front-ends and indexers);
/// `address` is used for actual on-chain token operations.
#[derive(Clone)]
#[contracttype]
pub struct PaymentAsset {
    /// Whether this is native XLM or a specific Stellar asset.
    pub kind: AssetKind,
    /// The on-chain address of the token contract.
    pub address: Address,
    /// Number of decimal places (typically 7 for XLM).
    pub decimals: u32,
}

impl PaymentAsset {
    fn client<'a>(&self, env: &'a Env) -> token::Client<'a> {
        token::Client::new(env, &self.address)
    }
}

// ===================== Governance & Timelock =====================

/// A time-locked governance action with multi-sig approvals.
#[derive(Clone)]
#[contracttype]
pub struct Timelock {
    /// Earliest timestamp at which the action can be executed.
    pub eta: u64,
    /// Addresses that have approved the proposal. Requires `quorum_ok` (>= 2).
    pub approvals: Vec<Address>,
    /// Whether the proposal has been executed.
    pub executed: bool,
}

fn quorum_ok(a: &Vec<Address>) -> bool {
    a.len() >= 2
}
fn now(env: &Env) -> u64 {
    env.ledger().timestamp()
}

/// A pending ERS governance update with a timelock.
#[derive(Clone)]
#[contracttype]
pub struct PendingERSUpdate {
    /// The proposed new value.
    pub payload: ERS,
    /// When the proposal was created.
    pub requested_at: u64,
    /// The associated timelock controlling execution.
    pub timelock: Timelock,
}

/// A pending Pricing governance update with a timelock.
#[derive(Clone)]
#[contracttype]
pub struct PendingPricingUpdate {
    /// The proposed new value.
    pub payload: Pricing,
    /// When the proposal was created.
    pub requested_at: u64,
    /// The associated timelock controlling execution.
    pub timelock: Timelock,
}

/// A pending Roles governance update with a timelock.
#[derive(Clone)]
#[contracttype]
pub struct PendingRolesUpdate {
    /// The proposed new value.
    pub payload: Roles,
    /// When the proposal was created.
    pub requested_at: u64,
    /// The associated timelock controlling execution.
    pub timelock: Timelock,
}

/// A pending contract upgrade with a timelock.
#[derive(Clone)]
#[contracttype]
pub struct PendingUpgradeUpdate {
    /// The proposed new value.
    pub payload: BytesN<32>,
    /// When the proposal was created.
    pub requested_at: u64,
    /// The associated timelock controlling execution.
    pub timelock: Timelock,
}

// ======================= Commercial Terms =======================

/// A volume-based discount tier. Discounts apply when `passed >= min_qty`.
#[derive(Clone)]
#[contracttype]
pub struct DiscountTier {
    /// Minimum passed-unit count to qualify for this tier.
    pub min_qty: u32,
    /// Discount in basis points (e.g., 150 = 1.5%).
    pub discount_bps: u32,
}

/// Pricing configuration for lot settlement.
#[derive(Clone)]
#[contracttype]
pub struct Pricing {
    /// Base price per passed unit in the payment asset's minor units.
    pub price_per_unit: i128,
    /// Penalty applied (in BPS) when defect rate exceeds ERS threshold.
    pub defect_penalty_bps: u32,
    /// Volume discount tiers. Must be sorted ascending by `min_qty`.
    pub tiers: Vec<DiscountTier>,
}

/// Engineering Requirement Specification — quality thresholds for lots.
#[derive(Clone)]
#[contracttype]
pub struct ERS {
    /// Spec version number, incremented on updates.
    pub version: u32,
    /// Maximum allowed defect rate in basis points. Exceeding triggers penalty.
    pub max_defect_bps: u32,
    /// Arbitrary key/value thresholds (e.g., test parameters).
    pub specs: Map<String, u32>,
}

/// Optional price oracle configuration with staleness checks.
/// When enabled, `execute_payment` will reject if the oracle data is stale.
#[derive(Clone)]
#[contracttype]
pub struct OracleConfig {
    /// Address of the oracle contract or signer.
    pub oracle: Address,
    /// Quote symbol for price feed.
    pub quote: Symbol,
    /// Maximum allowed age (in seconds) for oracle data.
    pub max_age_secs: u64,
    /// Whether oracle freshness checks are active.
    pub enabled: bool,
    /// Last known price from the oracle.
    pub last_price: i128,
    /// Timestamp of the last oracle update.
    pub last_update: u64,
}

// ============================ QA Staking ==========================

/// A pending QA stake withdrawal request, subject to a 7-day delay.
#[derive(Clone)]
#[contracttype]
pub struct UnstakeRequest {
    /// Amount of stake to withdraw.
    pub amount: i128,
    /// When the request was created.
    pub requested_at: u64,
    /// Earliest timestamp at which the withdrawal can be executed.
    pub available_at: u64,
}

// ============================ Lots & QA ==========================

/// Status of a production lot in the settlement pipeline.
///
/// ## State Machine
///
/// ```text
/// Open -> InQA       (qa_commit / qa_commit_full)
/// InQA -> Approved   (qa_update_counts when tested == quantity)
/// Approved -> Paid   (execute_payment)
/// Approved -> Closed (execute_payment when payment <= 0)
/// ```
///
/// `Disputed` and `Refunded` are reserved for future dispute-resolution features.
#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum LotStatus {
    /// Lot created by factory, awaiting QA commitment.
    Open,
    /// QA has committed metadata; testing is in progress.
    InQA,
    /// All units tested; lot is ready for payment settlement.
    Approved,
    /// Reserved for future use: lot is under dispute.
    Disputed, // reserved for future use
    /// Payment has been settled to the factory.
    Paid,
    /// Reserved for future use: lot has been refunded.
    Refunded, // reserved for future use
    /// Lot closed with zero or negative payment (e.g., penalties exceeded value).
    Closed,
}

/// Cryptographic attestation from a QA testbench, proving test equipment identity.
#[derive(Clone)]
#[contracttype]
pub struct TestbenchAttestation {
    /// Unique identifier for the test bench hardware.
    pub bench_id: String,
    /// Hash of the firmware running on the test bench at time of testing.
    pub firmware_hash: BytesN<32>,
    /// Address that signed the attestation.
    pub signer: Address,
    /// Timestamp when the attestation was created.
    pub timestamp: u64,
}

/// Metadata committed by QA for a production lot. Built incrementally via
/// `qa_commit`, `qa_commit_serials`, `qa_commit_attestation`, or all-at-once via
/// `qa_commit_full`.
#[derive(Clone)]
#[contracttype]
pub struct QAMetadata {
    /// Merkle root over test artifacts / results.
    pub commit_root: BytesN<32>,
    /// URI pointing to the full QA report (e.g., IPFS hash).
    pub report_uri: String,
    /// Optional Merkle root over serial numbers tested.
    pub serials_root: Option<BytesN<32>>,
    /// Number of serials covered by `serials_root`.
    pub serials_count: u32,
    /// Optional testbench hardware attestation (empty Vec = None, single element = Some).
    pub bench: Vec<TestbenchAttestation>,
}

/// A production lot tracked through the settlement pipeline.
#[derive(Clone)]
#[contracttype]
pub struct Lot {
    /// Unique identifier for this lot.
    pub lot_id: String,
    /// Total number of units in the lot.
    pub quantity: u32,
    /// Number of units that have been tested so far.
    pub tested: u32,
    /// Number of units that passed QA.
    pub passed: u32,
    /// Number of units that failed QA.
    pub failed: u32,
    /// Current status in the settlement pipeline.
    pub status: LotStatus,
    /// QA metadata committed for this lot (empty Vec = None, single element = Some).
    pub qa_commit: Vec<QAMetadata>,
    /// Timestamp when the lot was created.
    pub created_at: u64,
    /// Timestamp of the most recent update.
    pub last_update: u64,
    /// Payment nonce, incremented on each payment attempt.
    pub pay_nonce: u32,
    /// Amount already paid in partial settlements.
    pub partial_paid_amount: i128,
    /// Address of the factory that created this lot.
    pub creator: Address,
}

// ============================= Challenges ============================

/// Status of a reinspection challenge.
#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum ChallengeStatus {
    /// Challenge is active; QA has not yet responded.
    Open,
    /// QA has submitted a timely response.
    Responded,
    /// QA missed the deadline; challenge expired.
    Expired,
    /// Reserved for future use: response validated on-chain.
    Validated, // reserved for future use
    /// Reserved for future use: response validation failed.
    Failed, // reserved for future use
}

/// A reinspection challenge against a lot, including deterministic sample and response.
#[derive(Clone)]
#[contracttype]
pub struct Challenge {
    /// Address that requested the reinspection.
    pub requested_by: Address,
    /// Random seed used for deterministic sample generation.
    pub seed: BytesN<32>,
    /// Number of units to re-inspect.
    pub sample_size: u32,
    /// Deterministically generated unit indices to re-inspect.
    pub sample_indices: Vec<u32>,
    /// Timestamp when the challenge was created.
    pub requested_at: u64,
    /// Deadline by which QA must respond.
    pub due_by: u64,
    /// Current challenge status.
    pub status: ChallengeStatus,
    /// Cost paid by the challenger (0.1% of lot value).
    pub cost_paid: i128,
    /// QA's response data, if submitted (empty Vec = None, single element = Some).
    pub response_data: Vec<ChallengeResponse>,
}

/// QA's response to a reinspection challenge, including proof data.
#[derive(Clone)]
#[contracttype]
pub struct ChallengeResponse {
    /// Number of re-inspected units that passed.
    pub pass_count: u32,
    /// Number of re-inspected units that failed.
    pub fail_count: u32,
    /// Hash of the proof data supporting the response.
    pub proof_hash: BytesN<32>,
    /// Timestamp when the response was submitted.
    pub responded_at: u64,
}

// ======================== Service Fabric ========================

/// Development stage for a manufacturing service order.
#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum ServiceStage {
    /// Engineering Validation Test — first functional prototypes.
    EVT,
    /// Design Validation Test — refined prototypes for design sign-off.
    DVT,
    /// Production Validation Test — pre-production trial run.
    PVT,
    /// Mass Production — full-scale manufacturing.
    MP,
    /// Sustaining — ongoing production support and maintenance.
    Sustaining,
}

/// Status of a service order in the fabric pipeline.
///
/// ## State Machine
///
/// ```text
/// Requested -> Accepted   (accept_service_order by factory)
/// Accepted  -> Delivered   (submit_artifacts by factory)
/// Delivered -> Validated   (attest_completion by oracle — mints SVT)
/// Validated -> Settled     (settle_service — pays factory or issues credits)
/// ```
#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum OrderStatus {
    /// OEM has created the order; awaiting factory acceptance.
    Requested,
    /// Factory has accepted; work in progress.
    Accepted,
    /// Factory has submitted deliverables (artifacts/images uploaded).
    Delivered,
    /// FairBuild oracle has validated completion and minted an SVT.
    Validated,
    /// Payment or credits have been issued to the factory.
    Settled,
    /// Order cancelled before settlement.
    Cancelled,
}

/// A service request describing what the OEM needs from the manufacturing partner.
#[derive(Clone)]
#[contracttype]
pub struct ServiceRequest {
    /// Human-readable description (e.g., "Thermal cycle 50 EVT samples").
    pub description: String,
    /// Development stage this service targets.
    pub stage: ServiceStage,
    /// Number of DUTs / units involved.
    pub quantity: u32,
    /// ERS version that governs acceptance criteria.
    pub ers_version: u32,
    /// Acceptance criteria as key/value thresholds (extends ERS.specs concept).
    pub acceptance_criteria: Map<String, u32>,
    /// Expected artifact types (e.g., "thermal_image", "xray_scan").
    pub required_artifacts: Vec<String>,
}

/// Oracle attestation that a service has been completed.
/// Submitted by FairBuild integrated services after detecting that production
/// images / artifacts uploaded by the manufacturing partner meet the
/// acceptance criteria.
#[derive(Clone)]
#[contracttype]
pub struct CompletionAttestation {
    /// Address of the FairBuild oracle that signed this attestation.
    pub oracle: Address,
    /// Merkle root over the uploaded artifacts / production images.
    pub artifacts_root: BytesN<32>,
    /// Number of artifacts covered.
    pub artifacts_count: u32,
    /// Which acceptance criteria were satisfied (key → measured value).
    pub criteria_met: Map<String, u32>,
    /// URI pointing to the full validation report (e.g., IPFS).
    pub report_uri: String,
    /// Timestamp when the attestation was created.
    pub attested_at: u64,
}

/// A service order tracked through the fabric pipeline.
#[derive(Clone)]
#[contracttype]
pub struct ServiceOrder {
    /// Unique identifier for this order.
    pub order_id: String,
    /// The service request details.
    pub request: ServiceRequest,
    /// Current status in the fabric pipeline.
    pub status: OrderStatus,
    /// Amount of escrow locked for this order.
    pub escrow_locked: i128,
    /// Price agreed for the service (in payment asset minor units).
    pub agreed_price: i128,
    /// Factory's submitted artifact root (set on delivery).
    pub artifacts_root: Vec<BytesN<32>>,
    /// Completion attestation from FairBuild oracle (empty Vec = None).
    pub attestation: Vec<CompletionAttestation>,
    /// ID of the minted SVT (0 = not yet minted).
    pub svt_id: u64,
    /// Whether settlement was via credits (true) or direct payment (false).
    pub settled_as_credit: bool,
    /// Address of the OEM who created this order.
    pub oem: Address,
    /// Address of the factory that accepted this order.
    pub factory: Address,
    /// Timestamp when the order was created.
    pub created_at: u64,
    /// Timestamp of the most recent update.
    pub last_update: u64,
}

/// Analytics for the service fabric.
#[derive(Clone)]
#[contracttype]
pub struct ServiceAnalytics {
    /// Total service orders created.
    pub total_orders: u64,
    /// Total orders that reached Validated status.
    pub total_validated: u64,
    /// Total orders settled.
    pub total_settled: u64,
    /// Total SVTs minted.
    pub total_svts_minted: u64,
    /// Total credits issued (cumulative).
    pub total_credits_issued: i128,
    /// Total credits redeemed (cumulative).
    pub total_credits_redeemed: i128,
}

// ============================= State ============================

/// Configuration parameters for contract initialization.
#[derive(Clone)]
#[contracttype]
pub struct InitConfig {
    pub min_escrow_lots: u32,
    pub min_qa_stake: i128,
    pub oem_bond: i128,
    pub dispute_window_secs: u64,
}

/// Top-level contract state, stored under the `S` key. Contains all configuration,
/// balances, counters, and governance queues.
#[derive(Clone)]
#[contracttype]
pub struct State {
    /// The three fixed roles (OEM, Factory, QA).
    pub roles: Roles,
    /// Payment token configuration.
    pub pay_asset: PaymentAsset,
    /// Pricing rules including per-unit price, discount tiers, and defect penalty.
    pub pricing: Pricing,
    /// Current engineering requirement specification.
    pub ers: ERS,
    /// Optional oracle configuration for price freshness checks (empty Vec = None, single element = Some).
    pub oracle: Vec<OracleConfig>,

    /// Minimum number of lots' worth of escrow that must be maintained.
    pub min_escrow_lots: u32,
    /// Current escrow balance held by the contract.
    pub escrow_balance: i128,

    /// Minimum QA stake required for lot creation and payment settlement.
    pub min_qa_stake: i128,
    /// Total QA stake currently held.
    pub qa_stake: i128,
    /// Portion of QA stake locked in active challenges.
    pub qa_locked_stake: i128,
    /// Queue of pending unstake requests with time locks.
    pub qa_unstake_requests: Vec<UnstakeRequest>,

    /// OEM performance bond amount.
    pub oem_bond: i128,

    /// Minimum time window (in seconds) after approval before payment can settle.
    pub dispute_window_secs: u64,

    /// Whether the contract is paused (blocks lot creation and payment).
    pub paused: bool,
    /// Running count of all units across all created lots.
    pub total_units_produced: u64,
    /// Running count of all units that passed QA.
    pub total_units_approved: u64,
    /// Running count of all challenges created.
    pub total_challenges: u64,
    /// Running count of challenges that resulted in a QA slash.
    pub total_successful_challenges: u64,

    /// Pending ERS update behind a governance timelock (empty Vec = None, single element = Some).
    pub ers_pending: Vec<PendingERSUpdate>,
    /// Pending pricing update behind a governance timelock (empty Vec = None, single element = Some).
    pub pricing_pending: Vec<PendingPricingUpdate>,
    /// Pending roles update behind a governance timelock (empty Vec = None, single element = Some).
    pub roles_pending: Vec<PendingRolesUpdate>,
    /// Pending contract upgrade behind a governance timelock (empty Vec = None, single element = Some).
    pub upgrade_pending: Vec<PendingUpgradeUpdate>,

    /// Reentrancy guard flag. `true` while a state-mutating operation is in progress.
    pub entered: bool,

    // ---- Service Fabric fields ----
    /// Address of the FairBuild oracle authorized to attest service completions.
    pub fairbuild_oracle: Vec<Address>,
    /// Running counter for SVT token IDs.
    pub next_svt_id: u64,
    /// Service fabric analytics counters.
    pub svc_total_orders: u64,
    pub svc_total_validated: u64,
    pub svc_total_settled: u64,
    pub svc_total_svts_minted: u64,
    pub svc_total_credits_issued: i128,
    pub svc_total_credits_redeemed: i128,
}

// ========================== Analytics ============================

/// Typed return value for `view_analytics`, providing a dashboard-friendly snapshot
/// of contract health and cumulative statistics.
#[derive(Clone)]
#[contracttype]
pub struct Analytics {
    /// Total units across all lots ever created.
    pub total_units_produced: u64,
    /// Total units that passed QA across all lots.
    pub total_units_approved: u64,
    /// Total number of reinspection challenges filed.
    pub total_challenges: u64,
    /// Number of challenges that resulted in QA slashing.
    pub total_successful_challenges: u64,
    /// Current QA stake held by the contract.
    pub qa_stake: i128,
    /// Portion of QA stake locked in active challenges.
    pub qa_locked_stake: i128,
    /// Current OEM escrow balance.
    pub escrow_balance: i128,
    /// Whether the contract is currently paused.
    pub paused: bool,
}

// =========================== Storage Keys =======================

const S: Symbol = symbol_short!("S");
const LOTS: Symbol = symbol_short!("LOTS");
const CHAL: Symbol = symbol_short!("CHAL");
const CHAL_LIMIT: Symbol = symbol_short!("CHALLIM");
const ORDERS: Symbol = symbol_short!("ORDERS");
const CREDITS: Symbol = symbol_short!("CREDITS");
const SVTS: Symbol = symbol_short!("SVTS");

// ============================ Helpers ===========================

/// Returns `true` if `who` is one of the three registered roles.
fn is_party(who: &Address, r: &Roles) -> bool {
    who == &r.oem || who == &r.factory || who == &r.qa
}

/// Requires that `who` has authorized the call and is a registered role.
fn require_party(env: &Env, who: &Address, r: &Roles) {
    who.require_auth();
    if !is_party(who, r) {
        panic_with_error!(env, Err::NotAuthorized);
    }
}

/// Panics if the contract is paused.
fn require_not_paused(env: &Env, st: &State) {
    if st.paused {
        panic_with_error!(env, Err::InvalidState);
    }
}

/// Acquires the reentrancy lock. Panics with `Reentrancy` if already held.
fn enter(env: &Env, st: &mut State) {
    if st.entered {
        panic_with_error!(env, Err::Reentrancy);
    }
    st.entered = true;
    env.storage().persistent().set(&S, st);
}

/// Releases the reentrancy lock.
fn exit(env: &Env, st: &mut State) {
    st.entered = false;
    env.storage().persistent().set(&S, st);
}

/// Checked multiplication. Panics with `Overflow` on overflow.
fn safe_mul(env: &Env, a: i128, b: i128) -> i128 {
    match a.checked_mul(b) {
        Some(result) => result,
        None => panic_with_error!(env, Err::Overflow),
    }
}

/// Checked addition. Panics with `Overflow` on overflow.
fn safe_add(env: &Env, a: i128, b: i128) -> i128 {
    match a.checked_add(b) {
        Some(result) => result,
        None => panic_with_error!(env, Err::Overflow),
    }
}

/// Checked subtraction. Panics with `Overflow` on underflow.
fn safe_sub(env: &Env, a: i128, b: i128) -> i128 {
    match a.checked_sub(b) {
        Some(result) => result,
        None => panic_with_error!(env, Err::Overflow),
    }
}

/// Finds the highest applicable discount tier for `qty` passed units.
/// Tiers must be sorted ascending by `min_qty` for correct behavior.
fn calc_discount_bps(tiers: &Vec<DiscountTier>, qty: u32) -> i128 {
    let mut d = 0i128;
    for t in tiers.iter() {
        if qty >= t.min_qty {
            d = t.discount_bps as i128;
        }
    }
    d
}

/// Computes total payment for a lot based on passed units and pricing.
///
/// Formula: `base = passed * price_per_unit`, then subtract the highest
/// applicable tier discount: `base - base * discount_bps / 10_000`.
/// Note: tiers must be sorted ascending by `min_qty` — the last matching
/// tier wins.
fn compute_price_for_lot(env: &Env, pr: &Pricing, passed: u32) -> i128 {
    let base = safe_mul(env, passed as i128, pr.price_per_unit);
    let d = calc_discount_bps(&pr.tiers, passed);
    if d > 0 {
        safe_sub(env, base, safe_mul(env, base, d) / 10_000)
    } else {
        base
    }
}

/// Panics with `OracleStale` if the oracle is enabled and its data is older
/// than `max_age_secs`.
fn ensure_oracle_fresh(env: &Env, oc: &OracleConfig) {
    if !oc.enabled {
        return;
    }

    let age = now(env) - oc.last_update;
    if age > oc.max_age_secs {
        panic_with_error!(env, Err::OracleStale);
    }
}

/// Generates a deterministic, unique set of sample indices in `[0, n)`.
///
/// Uses a golden-ratio constant (`0x9E3779B97F4A7C15`) for hash mixing,
/// combined with the ledger timestamp to add environmental entropy beyond
/// the caller-supplied seed. Retries up to `sample_size * 10` times to
/// handle collisions.
fn deterministic_sample(env: &Env, n: u32, sample_size: u32, seed: &BytesN<32>) -> Vec<u32> {
    let mut out: Vec<u32> = Vec::new(env);
    if n == 0 || sample_size == 0 {
        return out;
    }

    let actual_sample = core::cmp::min(sample_size, n);
    let actual_sample = core::cmp::min(actual_sample, MAX_CHALLENGE_SAMPLE);

    let mut i: u32 = 0;
    let mut attempts = 0;

    while out.len() < actual_sample && attempts < actual_sample * 10 {
        // XOR two bytes from the seed at offset `i` and `i+16`, then
        // apply golden-ratio multiplicative mixing with the timestamp
        // and a linear congruential step to spread values.
        let b1 = seed.get(i % 32).unwrap_or(0);
        let b2 = seed.get((i + 16) % 32).unwrap_or(0);
        let mixed = ((b1 as u64) ^ (b2 as u64))
            .wrapping_mul(0x9E3779B97F4A7C15)
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

/// Enforces the per-address challenge rate limit (max 5 per hour).
/// Returns `true` if the challenge is allowed, `false` if rate-limited.
fn check_challenge_rate_limit(env: &Env, addr: &Address) -> bool {
    let mut limits: Map<Address, (u64, u32)> = env
        .storage()
        .persistent()
        .get(&CHAL_LIMIT)
        .unwrap_or(Map::new(env));

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

    /// Initializes the contract with roles, commercial terms, and configuration.
    ///
    /// All three role addresses must authorize the call. This function can only
    /// be called once (subsequent calls overwrite state).
    ///
    /// # Arguments
    /// * `oem` - OEM address (must `require_auth`)
    /// * `factory` - Factory address (must `require_auth`)
    /// * `qa` - QA address (must `require_auth`)
    /// * `pay_asset` - Payment token configuration
    /// * `pricing` - Price per unit, discount tiers, defect penalty
    /// * `ers` - Engineering requirement specification
    /// * `min_escrow_lots` - Minimum escrow funding in lot-equivalents
    /// * `oracle` - Optional oracle configuration
    /// * `min_qa_stake` - Minimum QA stake required
    /// * `oem_bond` - OEM performance bond amount
    /// * `dispute_window_secs` - Minimum dispute window (>= 1800s)
    ///
    /// # Errors
    /// * `Param` — if `price_per_unit <= 0`, `min_qa_stake < 0`, `oem_bond < 0`,
    ///   or `dispute_window_secs < 1800`
    pub fn init(
        env: Env,
        oem: Address,
        factory: Address,
        qa: Address,
        pay_asset: PaymentAsset,
        pricing: Pricing,
        ers: ERS,
        config: InitConfig,
        oracle: Vec<OracleConfig>,
    ) {
        oem.require_auth();
        factory.require_auth();
        qa.require_auth();

        if pricing.price_per_unit <= 0 || config.min_qa_stake < 0 || config.oem_bond < 0 {
            panic_with_error!(&env, Err::Param);
        }

        if config.dispute_window_secs < 1800 {
            panic_with_error!(&env, Err::Param);
        }

        let st = State {
            roles: Roles { oem, factory, qa },
            pay_asset,
            pricing,
            ers,
            oracle,
            min_escrow_lots: config.min_escrow_lots,
            escrow_balance: 0,
            min_qa_stake: config.min_qa_stake,
            qa_stake: 0,
            qa_locked_stake: 0,
            qa_unstake_requests: Vec::new(&env),
            oem_bond: config.oem_bond,
            dispute_window_secs: config.dispute_window_secs,
            paused: false,
            total_units_produced: 0,
            total_units_approved: 0,
            total_challenges: 0,
            total_successful_challenges: 0,
            ers_pending: Vec::new(&env),
            pricing_pending: Vec::new(&env),
            roles_pending: Vec::new(&env),
            upgrade_pending: Vec::new(&env),
            entered: false,
            fairbuild_oracle: Vec::new(&env),
            next_svt_id: 1,
            svc_total_orders: 0,
            svc_total_validated: 0,
            svc_total_settled: 0,
            svc_total_svts_minted: 0,
            svc_total_credits_issued: 0,
            svc_total_credits_redeemed: 0,
        };

        env.storage().persistent().set(&S, &st);
        env.storage()
            .persistent()
            .set(&LOTS, &Map::<String, Lot>::new(&env));
        env.storage()
            .persistent()
            .set(&CHAL, &Map::<String, Challenge>::new(&env));
        env.storage()
            .persistent()
            .set(&CHAL_LIMIT, &Map::<Address, (u64, u32)>::new(&env));
        env.storage()
            .persistent()
            .set(&ORDERS, &Map::<String, ServiceOrder>::new(&env));
        env.storage()
            .persistent()
            .set(&CREDITS, &Map::<Address, i128>::new(&env));
        env.storage()
            .persistent()
            .set(&SVTS, &Map::<u64, String>::new(&env));

        log!(&env, "Fairfoundry:init");
    }

    // --------------------- Escrow / Stake / Bond ----------------

    /// Deposits funds into the contract escrow. Only the OEM may call this.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the OEM
    /// * `Param` — `amount <= 0`
    ///
    /// # Events
    /// * `EscrowDeposited(oem, amount, timestamp)`
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

        env.events().publish(
            (Symbol::new(&env, "EscrowDeposited"), from.clone()),
            (amount, now(&env)),
        );

        exit(&env, &mut st);
    }

    /// Withdraws funds from the contract escrow. Only the OEM may call this.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the OEM
    /// * `InsufficientEscrow` — `amount <= 0` or exceeds balance
    ///
    /// # Events
    /// * `EscrowWithdrawn(oem, amount, timestamp)`
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

        env.events().publish(
            (Symbol::new(&env, "EscrowWithdrawn"), oem.clone()),
            (amount, now(&env)),
        );

        exit(&env, &mut st);
    }

    /// Stakes QA collateral into the contract. Only the QA role may call this.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the QA
    /// * `Param` — `amount <= 0`
    ///
    /// # Events
    /// * `QAStaked(qa, amount, timestamp)`
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

        env.events().publish(
            (Symbol::new(&env, "QAStaked"), qa.clone()),
            (amount, now(&env)),
        );

        exit(&env, &mut st);
    }

    /// Requests a delayed QA stake withdrawal. The withdrawal can be executed
    /// after `QA_UNSTAKE_DELAY` (7 days). QA stake cannot drop below `min_qa_stake`.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the QA
    /// * `InsufficientStake` — amount exceeds available or would breach minimum
    ///
    /// # Events
    /// * `QAUnstakeRequested(qa, amount, timestamp)`
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
        env.events().publish(
            (Symbol::new(&env, "QAUnstakeRequested"), qa.clone()),
            (amount, now(&env)),
        );
    }

    /// Executes all mature (past `available_at`) unstake requests, transferring
    /// the total amount to the QA address. Returns the amount unstaked.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the QA
    ///
    /// # Events
    /// * `QAUnstaked(qa, total_unstaked, timestamp)`
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

            env.events().publish(
                (Symbol::new(&env, "QAUnstaked"), qa.clone()),
                (total_unstaked, now(&env)),
            );
        }

        exit(&env, &mut st);
        total_unstaked
    }

    // --------------------------- Lots ---------------------------

    /// Creates a new production lot. Only the Factory role may call this.
    /// Requires sufficient QA stake and escrow funding.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the Factory
    /// * `InvalidState` — contract paused or QA stake below minimum
    /// * `Param` — `quantity == 0` or `> MAX_LOT_QUANTITY`
    /// * `AlreadyExists` — lot ID already in use
    /// * `InsufficientEscrow` — escrow below required minimum
    ///
    /// # Events
    /// * `LotCreated(factory, lot_id, quantity, timestamp)`
    pub fn create_lot(env: Env, factory: Address, lot_id: String, quantity: u32) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &factory, &st.roles);

        if factory != st.roles.factory {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        if quantity == 0 || quantity > MAX_LOT_QUANTITY {
            panic_with_error!(&env, Err::Param);
        }

        if st.qa_stake < st.min_qa_stake {
            panic_with_error!(&env, Err::InvalidState);
        }

        let mut lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
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
            qa_commit: Vec::new(&env),
            created_at: now(&env),
            last_update: now(&env),
            pay_nonce: 0,
            partial_paid_amount: 0,
            creator: factory.clone(),
        };

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);

        env.events().publish(
            (Symbol::new(&env, "LotCreated"), factory.clone()),
            (lot_id.clone(), quantity, now(&env)),
        );
    }

    // ------------------- QA Commit (convenience) -------------------

    /// Commits initial QA metadata for a lot (commit root and report URI).
    /// Sets lot status to `InQA`. Serials and attestation can be added later
    /// via `qa_commit_serials` and `qa_commit_attestation`.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the QA
    /// * `InvalidState` — contract paused or lot not `Open`/`InQA`
    /// * `NotFound` — lot does not exist
    ///
    /// # Events
    /// * `QACommitted(qa, lot_id, timestamp)`
    /// * `LotStatusChanged(lot_id, timestamp)`
    pub fn qa_commit(
        env: Env,
        qa: Address,
        lot_id: String,
        commit_root: BytesN<32>,
        report_uri: String,
    ) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &qa, &st.roles);

        if qa != st.roles.qa {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        let mut lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots
            .get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if lot.status != LotStatus::Open && lot.status != LotStatus::InQA {
            panic_with_error!(&env, Err::InvalidState);
        }

        let meta = QAMetadata {
            commit_root,
            report_uri,
            serials_root: None,
            serials_count: 0,
            bench: Vec::new(&env),
        };

        lot.qa_commit = soroban_sdk::vec![&env, meta];
        lot.status = LotStatus::InQA;
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);

        env.events().publish(
            (Symbol::new(&env, "QACommitted"), qa.clone()),
            (lot_id.clone(), now(&env)),
        );
        env.events()
            .publish((Symbol::new(&env, "LotStatusChanged"), lot_id), now(&env));
    }

    /// Adds serial-number Merkle root and count to existing QA metadata.
    /// Lot must already be `InQA` with a prior `qa_commit`.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the QA
    /// * `InvalidState` — lot not `InQA` or no prior commit
    /// * `NotFound` — lot does not exist
    ///
    /// # Events
    /// * `QACommittedSerials(qa, lot_id, serials_count, timestamp)`
    pub fn qa_commit_serials(
        env: Env,
        qa: Address,
        lot_id: String,
        serials_root: BytesN<32>,
        serials_count: u32,
    ) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &qa, &st.roles);

        if qa != st.roles.qa {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        let mut lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots
            .get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if lot.status != LotStatus::InQA {
            panic_with_error!(&env, Err::InvalidState);
        }

        if lot.qa_commit.is_empty() {
            panic_with_error!(&env, Err::InvalidState);
        }
        let mut meta = lot.qa_commit.get(0).unwrap();

        meta.serials_root = Some(serials_root);
        meta.serials_count = serials_count;

        lot.qa_commit = soroban_sdk::vec![&env, meta];
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);

        env.events().publish(
            (Symbol::new(&env, "QACommittedSerials"), qa.clone()),
            (lot_id.clone(), serials_count, now(&env)),
        );
    }

    /// Adds testbench attestation to existing QA metadata.
    /// Lot must already be `InQA` with a prior `qa_commit`.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the QA
    /// * `InvalidState` — lot not `InQA` or no prior commit
    /// * `NotFound` — lot does not exist
    ///
    /// # Events
    /// * `QACommittedAttestation(qa, lot_id, timestamp)`
    pub fn qa_commit_attestation(
        env: Env,
        qa: Address,
        lot_id: String,
        bench_id: String,
        firmware_hash: BytesN<32>,
        signer: Address,
    ) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &qa, &st.roles);

        if qa != st.roles.qa {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        let mut lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots
            .get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if lot.status != LotStatus::InQA {
            panic_with_error!(&env, Err::InvalidState);
        }

        if lot.qa_commit.is_empty() {
            panic_with_error!(&env, Err::InvalidState);
        }
        let mut meta = lot.qa_commit.get(0).unwrap();

        let attestation = TestbenchAttestation {
            bench_id,
            firmware_hash,
            signer,
            timestamp: now(&env),
        };

        meta.bench = soroban_sdk::vec![&env, attestation];
        lot.qa_commit = soroban_sdk::vec![&env, meta];
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);

        env.events().publish(
            (Symbol::new(&env, "QACommittedAttestation"), qa.clone()),
            (lot_id.clone(), now(&env)),
        );
    }

    /// Commits all QA metadata in a single call: commit root, report URI,
    /// serial-number Merkle tree, and testbench attestation. Sets lot status to `InQA`.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the QA
    /// * `InvalidState` — contract paused or lot not `Open`/`InQA`
    /// * `NotFound` — lot does not exist
    ///
    /// # Events
    /// * `QACommittedFull(qa, lot_id, serials_count, timestamp)`
    /// * `LotStatusChanged(lot_id, timestamp)`
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
        signer: Address,
    ) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &qa, &st.roles);

        if qa != st.roles.qa {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        let mut lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots
            .get(lot_id.clone())
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
            bench: soroban_sdk::vec![&env, attestation],
        };

        lot.qa_commit = soroban_sdk::vec![&env, meta];
        lot.status = LotStatus::InQA;
        lot.last_update = now(&env);

        lots.set(lot_id.clone(), lot);
        env.storage().persistent().set(&LOTS, &lots);

        env.events().publish(
            (Symbol::new(&env, "QACommittedFull"), qa.clone()),
            (lot_id.clone(), serials_count, now(&env)),
        );
        env.events()
            .publish((Symbol::new(&env, "LotStatusChanged"), lot_id), now(&env));
    }

    /// Updates the pass/fail counts for a lot. When `tested == quantity`,
    /// the lot automatically transitions to `Approved`.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the QA
    /// * `InvalidCounts` — `tested != passed + failed` or `tested > quantity`
    /// * `NotFound` — lot does not exist
    ///
    /// # Events
    /// * `QAUpdated(qa, lot_id, tested, passed, failed)`
    /// * `LotStatusChanged(lot_id, timestamp)` — when status transitions
    pub fn qa_update_counts(
        env: Env,
        qa: Address,
        lot_id: String,
        tested: u32,
        passed: u32,
        failed: u32,
    ) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);

        if qa != st.roles.qa {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        if tested != passed + failed {
            panic_with_error!(&env, Err::InvalidCounts);
        }

        let mut lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots
            .get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if tested > lot.quantity {
            panic_with_error!(&env, Err::InvalidCounts);
        }

        let old_status = lot.status.clone();
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

        env.events().publish(
            (Symbol::new(&env, "QAUpdated"), qa.clone()),
            (lot_id.clone(), tested, passed, failed),
        );

        if lot.status != old_status {
            env.events()
                .publish((Symbol::new(&env, "LotStatusChanged"), lot_id), now(&env));
        }
    }

    // ------------------------ Re-inspection --------------------------

    /// Requests a reinspection challenge on a lot. Any registered role may call this.
    /// Charges a fee (0.1% of lot value) and locks 20% of `min_qa_stake`.
    /// Returns the deterministically generated sample indices.
    ///
    /// # Arguments
    /// * `requester` - Must be OEM, Factory, or QA
    /// * `sample_size` - Number of units to re-inspect (1..=MAX_CHALLENGE_SAMPLE)
    /// * `response_deadline_secs` - Seconds QA has to respond
    /// * `seed` - Random seed for deterministic sampling
    ///
    /// # Errors
    /// * `ChallengeLimitExceeded` — address hit 5/hour rate limit
    /// * `NotFound` — lot does not exist
    /// * `InvalidState` — lot has no QA commit
    /// * `Param` — no serials root, or sample size out of range
    /// * `InsufficientEscrow` — OEM escrow insufficient for challenge fee
    ///
    /// # Events
    /// * `ReinspectRequested(requester, lot_id, sample_size, cost, timestamp)`
    pub fn request_reinspect(
        env: Env,
        requester: Address,
        lot_id: String,
        sample_size: u32,
        response_deadline_secs: u64,
        seed: BytesN<32>,
    ) -> Vec<u32> {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &requester, &st.roles);

        if !check_challenge_rate_limit(&env, &requester) {
            panic_with_error!(&env, Err::ChallengeLimitExceeded);
        }

        let lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let lot = lots
            .get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if lot.qa_commit.is_empty() {
            panic_with_error!(&env, Err::InvalidState);
        }
        let meta = lot.qa_commit.get(0).unwrap();

        let n = meta.serials_count;
        if n == 0 || meta.serials_root.is_none() {
            panic_with_error!(&env, Err::Param);
        }

        if sample_size == 0 || sample_size > MAX_CHALLENGE_SAMPLE {
            panic_with_error!(&env, Err::Param);
        }

        // Note: lot_value can be zero when lot.passed == 0 (no units passed yet),
        // resulting in a zero challenge fee.
        let lot_value = compute_price_for_lot(&env, &st.pricing, lot.passed);
        let challenge_cost = safe_mul(&env, lot_value, CHALLENGE_COST_BPS as i128) / 10_000;

        enter(&env, &mut st);

        // Deduct challenge cost from requester
        if requester == st.roles.oem {
            if st.escrow_balance < challenge_cost {
                panic_with_error!(&env, Err::InsufficientEscrow);
            }
            st.escrow_balance = safe_sub(&env, st.escrow_balance, challenge_cost);
        } else {
            let c = st.pay_asset.client(&env);
            c.transfer(&requester, &env.current_contract_address(), &challenge_cost);
        }

        // Lock 20% of min_qa_stake for this challenge
        let stake_to_lock = safe_mul(&env, st.min_qa_stake, 20) / 100;
        st.qa_locked_stake = safe_add(&env, st.qa_locked_stake, stake_to_lock);

        let indices = deterministic_sample(&env, n, sample_size, &seed);

        let mut chal_map: Map<String, Challenge> = env.storage().persistent().get(&CHAL).unwrap();

        let ch = Challenge {
            requested_by: requester.clone(),
            seed,
            sample_size,
            sample_indices: indices.clone(),
            requested_at: now(&env),
            due_by: now(&env) + response_deadline_secs,
            status: ChallengeStatus::Open,
            cost_paid: challenge_cost,
            response_data: Vec::new(&env),
        };

        chal_map.set(lot_id.clone(), ch);
        env.storage().persistent().set(&CHAL, &chal_map);

        st.total_challenges += 1;

        exit(&env, &mut st);

        env.events().publish(
            (Symbol::new(&env, "ReinspectRequested"), requester.clone()),
            (lot_id.clone(), sample_size, challenge_cost, now(&env)),
        );

        indices
    }

    /// QA responds to a reinspection challenge with pass/fail counts and proof hash.
    /// If the response is timely (before `due_by`), the challenge fee is refunded
    /// to the requester.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the QA
    /// * `NoChallenge` — no challenge for this lot
    /// * `InvalidState` — challenge not `Open`
    /// * `InvalidCounts` — `pass_count + fail_count != sample_size`
    ///
    /// # Events
    /// * `ReinspectResponded(qa, lot_id, pass_count, fail_count, proof_hash)`
    pub fn qa_reinspect_respond(
        env: Env,
        qa: Address,
        lot_id: String,
        pass_count: u32,
        fail_count: u32,
        proof_hash: BytesN<32>,
    ) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &qa, &st.roles);

        if qa != st.roles.qa {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        enter(&env, &mut st);

        let mut chal_map: Map<String, Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        let mut ch = chal_map
            .get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NoChallenge));

        if ch.status != ChallengeStatus::Open {
            panic_with_error!(&env, Err::InvalidState);
        }

        if pass_count + fail_count != ch.sample_size {
            panic_with_error!(&env, Err::InvalidCounts);
        }

        let response = ChallengeResponse {
            pass_count,
            fail_count,
            proof_hash: proof_hash.clone(),
            responded_at: now(&env),
        };

        ch.response_data = soroban_sdk::vec![&env, response];
        ch.status = ChallengeStatus::Responded;

        // Unlock QA stake
        let stake_to_unlock = safe_mul(&env, st.min_qa_stake, 20) / 100;
        st.qa_locked_stake = safe_sub(&env, st.qa_locked_stake, stake_to_unlock);

        // Return challenge cost to requester if response is timely
        if now(&env) <= ch.due_by {
            let c = st.pay_asset.client(&env);
            c.transfer(
                &env.current_contract_address(),
                &ch.requested_by,
                &ch.cost_paid,
            );
        }

        chal_map.set(lot_id.clone(), ch);
        env.storage().persistent().set(&CHAL, &chal_map);

        exit(&env, &mut st);

        env.events().publish(
            (Symbol::new(&env, "ReinspectResponded"), qa.clone()),
            (lot_id.clone(), pass_count, fail_count, proof_hash),
        );
    }

    /// Slashes QA stake when a challenge deadline has passed without response.
    /// The slash is split 50/50 between the challenger and the OEM.
    ///
    /// # Errors
    /// * `Param` — `slash_bps > MAX_SLASH_BPS` (2000 = 20%)
    /// * `NoChallenge` — no challenge for this lot
    /// * `InvalidState` — challenge not `Open`
    /// * `TooEarlyOrLate` — deadline has not yet passed
    ///
    /// # Events
    /// * `ReinspectDefaultSlashed(caller, lot_id, slash_bps, slash_amount, timestamp)`
    pub fn challenge_default_slash(env: Env, caller: Address, lot_id: String, slash_bps: u32) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);

        if slash_bps > MAX_SLASH_BPS {
            panic_with_error!(&env, Err::Param);
        }

        enter(&env, &mut st);

        let mut chal_map: Map<String, Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        let mut ch = chal_map
            .get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NoChallenge));

        if ch.status != ChallengeStatus::Open {
            panic_with_error!(&env, Err::InvalidState);
        }

        if now(&env) <= ch.due_by {
            panic_with_error!(&env, Err::TooEarlyOrLate);
        }

        // Calculate slash amount as a percentage of QA stake
        let slash = safe_mul(&env, st.qa_stake, slash_bps as i128) / 10_000;

        if slash > 0 && st.qa_stake >= slash {
            let c = st.pay_asset.client(&env);
            // Split slash 50/50 between challenger and OEM
            let challenger_reward = slash / 2;
            let oem_reward = slash - challenger_reward;

            c.transfer(
                &env.current_contract_address(),
                &ch.requested_by,
                &challenger_reward,
            );
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
            (Symbol::new(&env, "ReinspectDefaultSlashed"), caller.clone()),
            (lot_id.clone(), slash_bps, slash, now(&env)),
        );
    }

    // ------------------------ Payment --------------------------

    /// Settles payment for an approved lot. Computes the payment based on passed
    /// units, applies discount tiers and defect penalties, then transfers from
    /// escrow to the Factory.
    ///
    /// Payment is blocked if: QA stake < minimum, oracle is stale (when enabled),
    /// or an open challenge exists for the lot.
    ///
    /// ## Defect penalty formula
    /// `defect_bps = (failed * 10_000) / tested` — if this exceeds
    /// `ers.max_defect_bps`, a penalty of `payment * defect_penalty_bps / 10_000`
    /// is subtracted from the settlement amount.
    ///
    /// # Errors
    /// * `InvalidState` — paused, QA stake below min, lot not `Approved`,
    ///   or open challenge exists
    /// * `OracleStale` — oracle enabled and data expired
    /// * `NotFound` — lot does not exist
    ///
    /// # Events
    /// * `LotPaid(lot_id, payment, timestamp)`
    /// * `LotStatusChanged(lot_id, timestamp)`
    pub fn execute_payment(env: Env, lot_id: String) -> i128 {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);

        if st.qa_stake < st.min_qa_stake {
            panic_with_error!(&env, Err::InvalidState);
        }

        if !st.oracle.is_empty() {
            let oc = st.oracle.get(0).unwrap();
            ensure_oracle_fresh(&env, &oc);
        }

        enter(&env, &mut st);

        let mut lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut lot = lots
            .get(lot_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if lot.status != LotStatus::Approved {
            panic_with_error!(&env, Err::InvalidState);
        }

        // Block payment if there's an open challenge
        let chal_map: Map<String, Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        if let Some(ch) = chal_map.get(lot_id.clone()) {
            if ch.status == ChallengeStatus::Open {
                panic_with_error!(&env, Err::InvalidState);
            }
        }

        let mut payment = compute_price_for_lot(&env, &st.pricing, lot.passed);

        // Apply defect penalty: defect_bps = (failed * 10000) / tested.
        // If this exceeds the ERS max_defect_bps threshold, subtract the
        // configured penalty percentage from the payment amount.
        let defect_bps = if lot.tested > 0 {
            safe_mul(&env, lot.failed as i128, 10_000) / (lot.tested as i128)
        } else {
            0
        };

        if defect_bps > (st.ers.max_defect_bps as i128) {
            let penalty = safe_mul(&env, payment, st.pricing.defect_penalty_bps as i128) / 10_000;
            payment = safe_sub(&env, payment, penalty);
        }

        // Deduct any prior partial payments
        if lot.partial_paid_amount > 0 {
            payment = safe_sub(&env, payment, lot.partial_paid_amount);
        }

        if payment <= 0 {
            lot.status = LotStatus::Closed;
            lot.pay_nonce += 1;
            lot.last_update = now(&env);
            lots.set(lot_id.clone(), lot);
            env.storage().persistent().set(&LOTS, &lots);

            env.events()
                .publish((Symbol::new(&env, "LotStatusChanged"), lot_id), now(&env));

            exit(&env, &mut st);
            return 0;
        }

        // Execute transfer from escrow to factory
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

        env.events().publish(
            (Symbol::new(&env, "LotPaid"), lot_id.clone()),
            (payment, now(&env)),
        );
        env.events()
            .publish((Symbol::new(&env, "LotStatusChanged"), lot_id), now(&env));

        payment
    }

    // =================== Service Fabric ====================

    /// Registers the FairBuild oracle address that is authorized to attest
    /// service completions. Only the OEM may call this.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the OEM
    ///
    /// # Events
    /// * `OracleRegistered(oem, oracle, timestamp)`
    pub fn register_fairbuild_oracle(env: Env, oem: Address, oracle: Address) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &oem, &st.roles);
        if oem != st.roles.oem {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        st.fairbuild_oracle = soroban_sdk::vec![&env, oracle.clone()];
        env.storage().persistent().set(&S, &st);

        env.events().publish(
            (Symbol::new(&env, "OracleRegistered"), oem),
            (oracle, now(&env)),
        );
    }

    /// Creates a new service order. Only the OEM may call this.
    /// Locks `agreed_price` from the OEM's escrow balance.
    ///
    /// # Arguments
    /// * `oem` - Must be the registered OEM
    /// * `order_id` - Unique identifier for this service order
    /// * `request` - Service request details (stage, quantity, criteria)
    /// * `agreed_price` - Price locked from escrow for this service
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the OEM
    /// * `AlreadyExists` — order ID already in use
    /// * `Param` — `agreed_price <= 0` or `quantity == 0`
    /// * `InsufficientEscrow` — escrow balance insufficient
    ///
    /// # Events
    /// * `ServiceOrderCreated(oem, order_id, stage, agreed_price, timestamp)`
    pub fn create_service_order(
        env: Env,
        oem: Address,
        order_id: String,
        request: ServiceRequest,
        agreed_price: i128,
    ) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &oem, &st.roles);

        if oem != st.roles.oem {
            panic_with_error!(&env, Err::NotAuthorized);
        }
        if agreed_price <= 0 || request.quantity == 0 {
            panic_with_error!(&env, Err::Param);
        }
        if request.quantity > MAX_LOT_QUANTITY {
            panic_with_error!(&env, Err::Param);
        }

        let mut orders: Map<String, ServiceOrder> =
            env.storage().persistent().get(&ORDERS).unwrap();
        if orders.contains_key(order_id.clone()) {
            panic_with_error!(&env, Err::AlreadyExists);
        }

        if st.escrow_balance < agreed_price {
            panic_with_error!(&env, Err::InsufficientEscrow);
        }

        enter(&env, &mut st);

        // Lock funds from escrow
        st.escrow_balance = safe_sub(&env, st.escrow_balance, agreed_price);

        let order = ServiceOrder {
            order_id: order_id.clone(),
            request: request.clone(),
            status: OrderStatus::Requested,
            escrow_locked: agreed_price,
            agreed_price,
            artifacts_root: Vec::new(&env),
            attestation: Vec::new(&env),
            svt_id: 0,
            settled_as_credit: false,
            oem: oem.clone(),
            factory: st.roles.factory.clone(),
            created_at: now(&env),
            last_update: now(&env),
        };

        orders.set(order_id.clone(), order);
        env.storage().persistent().set(&ORDERS, &orders);
        st.svc_total_orders += 1;

        exit(&env, &mut st);

        env.events().publish(
            (Symbol::new(&env, "ServiceOrderCreated"), oem),
            (order_id, request.stage, agreed_price, now(&env)),
        );
    }

    /// Factory accepts a service order, committing to perform the service.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the Factory
    /// * `NotFound` — order does not exist
    /// * `InvalidState` — order is not in `Requested` status
    ///
    /// # Events
    /// * `ServiceOrderAccepted(factory, order_id, timestamp)`
    pub fn accept_service_order(env: Env, factory: Address, order_id: String) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &factory, &st.roles);

        if factory != st.roles.factory {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        let mut orders: Map<String, ServiceOrder> =
            env.storage().persistent().get(&ORDERS).unwrap();
        let mut order = orders
            .get(order_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if order.status != OrderStatus::Requested {
            panic_with_error!(&env, Err::InvalidState);
        }

        order.status = OrderStatus::Accepted;
        order.last_update = now(&env);

        orders.set(order_id.clone(), order);
        env.storage().persistent().set(&ORDERS, &orders);

        env.events().publish(
            (Symbol::new(&env, "ServiceOrderAccepted"), factory),
            (order_id, now(&env)),
        );
    }

    /// Factory submits artifacts (e.g., production images uploaded to OEM database).
    /// Transitions the order to `Delivered`.
    ///
    /// # Arguments
    /// * `factory` - Must be the registered Factory
    /// * `order_id` - The service order ID
    /// * `artifacts_root` - Merkle root over the uploaded production images / artifacts
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the Factory
    /// * `NotFound` — order does not exist
    /// * `InvalidState` — order is not in `Accepted` status
    ///
    /// # Events
    /// * `ArtifactsSubmitted(factory, order_id, artifacts_root, timestamp)`
    pub fn submit_artifacts(
        env: Env,
        factory: Address,
        order_id: String,
        artifacts_root: BytesN<32>,
    ) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);
        require_party(&env, &factory, &st.roles);

        if factory != st.roles.factory {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        let mut orders: Map<String, ServiceOrder> =
            env.storage().persistent().get(&ORDERS).unwrap();
        let mut order = orders
            .get(order_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if order.status != OrderStatus::Accepted {
            panic_with_error!(&env, Err::InvalidState);
        }

        order.artifacts_root = soroban_sdk::vec![&env, artifacts_root.clone()];
        order.status = OrderStatus::Delivered;
        order.last_update = now(&env);

        orders.set(order_id.clone(), order);
        env.storage().persistent().set(&ORDERS, &orders);

        env.events().publish(
            (Symbol::new(&env, "ArtifactsSubmitted"), factory),
            (order_id, artifacts_root, now(&env)),
        );
    }

    /// FairBuild oracle attests that a service order has been completed.
    /// This validates the uploaded artifacts against acceptance criteria,
    /// mints a Service Validation Token (SVT), and transitions the order
    /// to `Validated`.
    ///
    /// The oracle is an off-chain FairBuild integrated service that monitors
    /// the OEM database for production images uploaded by the manufacturing
    /// partner and verifies they meet the service conditions.
    ///
    /// # Arguments
    /// * `oracle` - Must be the registered FairBuild oracle
    /// * `order_id` - The service order ID
    /// * `artifacts_root` - Merkle root the oracle computed over the artifacts
    /// * `artifacts_count` - Number of artifacts validated
    /// * `criteria_met` - Which acceptance criteria were satisfied
    /// * `report_uri` - URI to the full validation report
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the registered FairBuild oracle
    /// * `NotFound` — order does not exist
    /// * `InvalidState` — order is not in `Delivered` status
    ///
    /// # Events
    /// * `ServiceValidated(oracle, order_id, svt_id, timestamp)`
    /// * `SVTMinted(order_id, svt_id, factory, stage, timestamp)`
    pub fn attest_completion(
        env: Env,
        oracle: Address,
        order_id: String,
        artifacts_root: BytesN<32>,
        artifacts_count: u32,
        criteria_met: Map<String, u32>,
        report_uri: String,
    ) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();

        // Verify caller is the registered FairBuild oracle
        oracle.require_auth();
        if st.fairbuild_oracle.is_empty() || oracle != st.fairbuild_oracle.get(0).unwrap() {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        let mut orders: Map<String, ServiceOrder> =
            env.storage().persistent().get(&ORDERS).unwrap();
        let mut order = orders
            .get(order_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if order.status != OrderStatus::Delivered {
            panic_with_error!(&env, Err::InvalidState);
        }

        enter(&env, &mut st);

        // Create completion attestation
        let attestation = CompletionAttestation {
            oracle: oracle.clone(),
            artifacts_root,
            artifacts_count,
            criteria_met,
            report_uri,
            attested_at: now(&env),
        };

        // Mint SVT (on-ledger record)
        let svt_id = st.next_svt_id;
        st.next_svt_id += 1;
        st.svc_total_svts_minted += 1;
        st.svc_total_validated += 1;

        // Record SVT -> order mapping
        let mut svts: Map<u64, String> = env.storage().persistent().get(&SVTS).unwrap();
        svts.set(svt_id, order_id.clone());
        env.storage().persistent().set(&SVTS, &svts);

        order.attestation = soroban_sdk::vec![&env, attestation];
        order.svt_id = svt_id;
        order.status = OrderStatus::Validated;
        order.last_update = now(&env);

        orders.set(order_id.clone(), order.clone());
        env.storage().persistent().set(&ORDERS, &orders);

        exit(&env, &mut st);

        env.events().publish(
            (Symbol::new(&env, "ServiceValidated"), oracle),
            (order_id.clone(), svt_id, now(&env)),
        );
        env.events().publish(
            (Symbol::new(&env, "SVTMinted"), order_id),
            (svt_id, order.factory, order.request.stage, now(&env)),
        );
    }

    /// Settles a validated service order. The SVT (Service Validation Token)
    /// triggers the smart contract to release escrowed funds to the
    /// manufacturing partner — either as direct payment or on-ledger credits.
    ///
    /// # Arguments
    /// * `order_id` - The service order ID (must have an SVT / be Validated)
    /// * `as_credit` - If true, issue credits instead of direct payment
    ///
    /// # Errors
    /// * `InvalidState` — order is not in `Validated` status
    /// * `NotFound` — order does not exist
    ///
    /// # Events
    /// * `ServiceSettled(order_id, factory, amount, as_credit, timestamp)`
    pub fn settle_service(env: Env, order_id: String, as_credit: bool) -> i128 {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_not_paused(&env, &st);

        let mut orders: Map<String, ServiceOrder> =
            env.storage().persistent().get(&ORDERS).unwrap();
        let mut order = orders
            .get(order_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        if order.status != OrderStatus::Validated {
            panic_with_error!(&env, Err::InvalidState);
        }

        // SVT must exist (svt_id > 0)
        if order.svt_id == 0 {
            panic_with_error!(&env, Err::InvalidState);
        }

        enter(&env, &mut st);

        let payment = order.escrow_locked;

        if as_credit {
            // Issue credits to the factory's on-ledger account
            let mut credits: Map<Address, i128> = env.storage().persistent().get(&CREDITS).unwrap();
            let existing = credits.get(order.factory.clone()).unwrap_or(0);
            credits.set(order.factory.clone(), safe_add(&env, existing, payment));
            env.storage().persistent().set(&CREDITS, &credits);
            st.svc_total_credits_issued = safe_add(&env, st.svc_total_credits_issued, payment);
        } else {
            // Direct payment: transfer locked escrow to factory
            let c = st.pay_asset.client(&env);
            c.transfer(&env.current_contract_address(), &order.factory, &payment);
        }

        order.status = OrderStatus::Settled;
        order.settled_as_credit = as_credit;
        order.last_update = now(&env);
        st.svc_total_settled += 1;

        orders.set(order_id.clone(), order.clone());
        env.storage().persistent().set(&ORDERS, &orders);

        exit(&env, &mut st);

        env.events().publish(
            (Symbol::new(&env, "ServiceSettled"), order_id),
            (order.factory, payment, as_credit, now(&env)),
        );

        payment
    }

    /// Redeems accumulated credits for direct payment. Only the Factory
    /// (manufacturing partner) may call this.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the Factory
    /// * `Param` — `amount <= 0`
    /// * `InsufficientEscrow` — credit balance insufficient
    ///
    /// # Events
    /// * `CreditsRedeemed(factory, amount, timestamp)`
    pub fn redeem_credits(env: Env, factory: Address, amount: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &factory, &st.roles);

        if factory != st.roles.factory {
            panic_with_error!(&env, Err::NotAuthorized);
        }
        if amount <= 0 {
            panic_with_error!(&env, Err::Param);
        }

        enter(&env, &mut st);

        let mut credits: Map<Address, i128> = env.storage().persistent().get(&CREDITS).unwrap();
        let balance = credits.get(factory.clone()).unwrap_or(0);

        if amount > balance {
            panic_with_error!(&env, Err::InsufficientEscrow);
        }

        // Deduct credits and transfer payment
        credits.set(factory.clone(), safe_sub(&env, balance, amount));
        env.storage().persistent().set(&CREDITS, &credits);

        let c = st.pay_asset.client(&env);
        c.transfer(&env.current_contract_address(), &factory, &amount);

        st.svc_total_credits_redeemed = safe_add(&env, st.svc_total_credits_redeemed, amount);

        exit(&env, &mut st);

        env.events().publish(
            (Symbol::new(&env, "CreditsRedeemed"), factory),
            (amount, now(&env)),
        );
    }

    /// Cancels a service order that has not yet been delivered.
    /// Returns locked escrow to the OEM. Only OEM may call this.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the OEM
    /// * `NotFound` — order does not exist
    /// * `InvalidState` — order already delivered/validated/settled
    ///
    /// # Events
    /// * `ServiceOrderCancelled(oem, order_id, refund, timestamp)`
    pub fn cancel_service_order(env: Env, oem: Address, order_id: String) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &oem, &st.roles);

        if oem != st.roles.oem {
            panic_with_error!(&env, Err::NotAuthorized);
        }

        let mut orders: Map<String, ServiceOrder> =
            env.storage().persistent().get(&ORDERS).unwrap();
        let mut order = orders
            .get(order_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound));

        // Can only cancel before delivery
        if order.status != OrderStatus::Requested && order.status != OrderStatus::Accepted {
            panic_with_error!(&env, Err::InvalidState);
        }

        enter(&env, &mut st);

        let refund = order.escrow_locked;
        st.escrow_balance = safe_add(&env, st.escrow_balance, refund);

        order.status = OrderStatus::Cancelled;
        order.escrow_locked = 0;
        order.last_update = now(&env);

        orders.set(order_id.clone(), order);
        env.storage().persistent().set(&ORDERS, &orders);

        exit(&env, &mut st);

        env.events().publish(
            (Symbol::new(&env, "ServiceOrderCancelled"), oem),
            (order_id, refund, now(&env)),
        );
    }

    // --------------- Service Fabric Views ---------------

    /// Returns a single service order by ID.
    pub fn view_service_order(env: Env, order_id: String) -> ServiceOrder {
        let orders: Map<String, ServiceOrder> = env.storage().persistent().get(&ORDERS).unwrap();
        orders
            .get(order_id)
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound))
    }

    /// Lists service order IDs, optionally filtered by status.
    pub fn view_service_orders(env: Env, status_filter: Option<OrderStatus>) -> Vec<String> {
        let orders: Map<String, ServiceOrder> = env.storage().persistent().get(&ORDERS).unwrap();
        let mut result: Vec<String> = Vec::new(&env);
        for (order_id, order) in orders.iter() {
            match &status_filter {
                Some(filter) => {
                    if order.status == *filter {
                        result.push_back(order_id);
                    }
                }
                None => {
                    result.push_back(order_id);
                }
            }
        }
        result
    }

    /// Returns the credit balance for an address (typically the Factory).
    pub fn view_credits(env: Env, addr: Address) -> i128 {
        let credits: Map<Address, i128> = env.storage().persistent().get(&CREDITS).unwrap();
        credits.get(addr).unwrap_or(0)
    }

    /// Returns service fabric analytics.
    pub fn view_service_analytics(env: Env) -> ServiceAnalytics {
        let st: State = env.storage().persistent().get(&S).unwrap();
        ServiceAnalytics {
            total_orders: st.svc_total_orders,
            total_validated: st.svc_total_validated,
            total_settled: st.svc_total_settled,
            total_svts_minted: st.svc_total_svts_minted,
            total_credits_issued: st.svc_total_credits_issued,
            total_credits_redeemed: st.svc_total_credits_redeemed,
        }
    }

    /// Returns the SVT details: which order a given SVT ID maps to.
    pub fn view_svt(env: Env, svt_id: u64) -> String {
        let svts: Map<u64, String> = env.storage().persistent().get(&SVTS).unwrap();
        svts.get(svt_id)
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound))
    }

    // ---------------------- Governance ----------------------

    /// Proposes an ERS (Engineering Requirement Specification) update with a
    /// governance timelock. The delay is enforced to be at least `MIN_TIMELOCK_DELAY`
    /// (1 hour).
    ///
    /// # Events
    /// * `ERSProposed(caller, delay, timestamp)`
    pub fn propose_ers(env: Env, caller: Address, ers: ERS, delay_secs: u64) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();
        require_party(&env, &caller, &st.roles);

        let actual_delay = core::cmp::max(delay_secs, MIN_TIMELOCK_DELAY);

        let tl = Timelock {
            eta: now(&env) + actual_delay,
            approvals: soroban_sdk::vec![&env, caller.clone()],
            executed: false,
        };

        st.ers_pending = soroban_sdk::vec![
            &env,
            PendingERSUpdate {
                payload: ers,
                requested_at: now(&env),
                timelock: tl,
            }
        ];

        env.storage().persistent().set(&S, &st);
        env.events().publish(
            (Symbol::new(&env, "ERSProposed"), caller.clone()),
            (actual_delay, now(&env)),
        );
    }

    /// Updates the oracle price and timestamp. Only the registered oracle signer
    /// may call this.
    ///
    /// # Errors
    /// * `NotAuthorized` — caller is not the oracle signer
    ///
    /// # Events
    /// * `OracleUpdated(price, timestamp)`
    pub fn update_oracle_price(env: Env, oracle: Address, price: i128) {
        let mut st: State = env.storage().persistent().get(&S).unwrap();

        if !st.oracle.is_empty() {
            let mut oc = st.oracle.get(0).unwrap();
            if oracle != oc.oracle {
                panic_with_error!(&env, Err::NotAuthorized);
            }

            oracle.require_auth();

            oc.last_price = price;
            oc.last_update = now(&env);
            st.oracle = soroban_sdk::vec![&env, oc];

            env.storage().persistent().set(&S, &st);
            env.events()
                .publish((Symbol::new(&env, "OracleUpdated"),), (price, now(&env)));
        }
    }

    // ------------------------- Views ----------------

    /// Returns the full contract state.
    pub fn view_state(env: Env) -> State {
        env.storage().persistent().get(&S).unwrap()
    }

    /// Returns a single lot by ID.
    ///
    /// # Errors
    /// * `NotFound` — lot does not exist
    pub fn view_lot(env: Env, lot_id: String) -> Lot {
        let lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        lots.get(lot_id)
            .unwrap_or_else(|| panic_with_error!(&env, Err::NotFound))
    }

    /// Returns the challenge for a lot.
    ///
    /// # Errors
    /// * `NoChallenge` — no challenge exists for this lot
    pub fn view_challenge(env: Env, lot_id: String) -> Challenge {
        let chal_map: Map<String, Challenge> = env.storage().persistent().get(&CHAL).unwrap();
        chal_map
            .get(lot_id)
            .unwrap_or_else(|| panic_with_error!(&env, Err::NoChallenge))
    }

    /// Returns a typed analytics snapshot of contract health and statistics.
    pub fn view_analytics(env: Env) -> Analytics {
        let st: State = env.storage().persistent().get(&S).unwrap();
        Analytics {
            total_units_produced: st.total_units_produced,
            total_units_approved: st.total_units_approved,
            total_challenges: st.total_challenges,
            total_successful_challenges: st.total_successful_challenges,
            qa_stake: st.qa_stake,
            qa_locked_stake: st.qa_locked_stake,
            escrow_balance: st.escrow_balance,
            paused: st.paused,
        }
    }

    /// Lists lot IDs, optionally filtered by status.
    pub fn view_lots(env: Env, status_filter: Option<LotStatus>) -> Vec<String> {
        let lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut result: Vec<String> = Vec::new(&env);
        for (lot_id, lot) in lots.iter() {
            match &status_filter {
                Some(filter) => {
                    if lot.status == *filter {
                        result.push_back(lot_id);
                    }
                }
                None => {
                    result.push_back(lot_id);
                }
            }
        }
        result
    }

    /// Batch-fetches lots by ID. Missing IDs are silently skipped.
    pub fn view_lots_batch(env: Env, lot_ids: Vec<String>) -> Vec<Lot> {
        let lots: Map<String, Lot> = env.storage().persistent().get(&LOTS).unwrap();
        let mut result: Vec<Lot> = Vec::new(&env);
        for lot_id in lot_ids.iter() {
            if let Some(lot) = lots.get(lot_id) {
                result.push_back(lot);
            }
        }
        result
    }

    /// Returns the queue of pending QA unstake requests.
    pub fn view_unstake_requests(env: Env) -> Vec<UnstakeRequest> {
        let st: State = env.storage().persistent().get(&S).unwrap();
        st.qa_unstake_requests
    }

    /// Returns the pending ERS governance proposal, if any.
    pub fn view_pending_ers(env: Env) -> Vec<PendingERSUpdate> {
        let st: State = env.storage().persistent().get(&S).unwrap();
        st.ers_pending
    }

    /// Returns QA stake breakdown: `(total, locked, available)`.
    pub fn view_qa_stake(env: Env) -> (i128, i128, i128) {
        let st: State = env.storage().persistent().get(&S).unwrap();
        let available = safe_sub(&env, st.qa_stake, st.qa_locked_stake);
        (st.qa_stake, st.qa_locked_stake, available)
    }

    /// Returns the remaining challenge allowance and window reset time for an address.
    /// Returns `(remaining_challenges, reset_timestamp)`. If the window has reset,
    /// `remaining_challenges` is 5 and `reset_timestamp` is 0.
    pub fn view_challenge_limit(env: Env, addr: Address) -> (u32, u64) {
        let limits: Map<Address, (u64, u32)> = env
            .storage()
            .persistent()
            .get(&CHAL_LIMIT)
            .unwrap_or(Map::new(&env));
        let current_time = now(&env);
        let (last_time, count) = limits.get(addr).unwrap_or((0, 0));
        if current_time - last_time > 3600 {
            (5, 0)
        } else {
            let remaining = 5_u32.saturating_sub(count);
            let reset_at = last_time + 3600;
            (remaining, reset_at)
        }
    }
}

#[cfg(test)]
mod test;
