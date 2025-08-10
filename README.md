# Fairfoundry — escrowed manufacturing settlements with QA & challenges (Soroban)

> License: CC BY‑NC 4.0 • Target chain: Stellar Soroban • Language: Rust (`soroban_sdk`)

## What this contract does (purpose)

Fairfoundry is a settlement layer for OEM ↔ Factory production where a third‑party QA signs off on lots. It holds OEM funds in escrow, tracks lot testing, lets any registered party request a re‑inspection on a deterministic sample, and then settles payment to the factory (with discounts and defect penalties) only after QA and challenge windows clear. It also supports QA staking/slashing and an optional price oracle freshness check.

### Why Fairbuild

Fairbuild (fairb.com) helps OEMs and manufacturers of precision, high‑volume products make production agreements **transparent, standardized, and enforceable**. By encoding a normalized contract on‑chain—covering escrow, milestones, ERS/QA metrics, and challenge/penalty rules—Fairbuild reduces ambiguity and shortens dispute cycles. On‑ledger events create a shared, tamper‑evident record of lots, test results, and payments, improving supplier transparency and auditability. Production and contractual risk is managed through pre‑funded escrow, staking/slashing for service levels, time‑boxed challenge windows, and deterministic re‑inspection. The same primitives carry across the full product lifecycle—from NPI to volume to sustaining—so quality targets and ERS versions remain traceable as products evolve.

## Quick start (local testing with `soroban-cli`)

> These instructions assume a recent Soroban toolchain. Command names can change across versions; when in doubt, run `soroban --help`.

### 1) Prereqs

- Rust + Cargo
- Wasm target and CLI

```bash
# Install the correct Wasm target for your Rust version
# Rust >= 1.85.0 → wasm32v1-none
rustup target add wasm32v1-none
# Older Rust versions → wasm32-unknown-unknown
rustup target add wasm32-unknown-unknown

cargo install --locked soroban-cli
```

### 2) Build the contract

```bash
# From repo root (where Cargo.toml lives)
soroban contract build
# Artifact: target/wasm32v1-none/release/*.wasm  (or target/wasm32-unknown-unknown/release/*.wasm on older Rust) 
```

### 3) Start a local network & configure

```bash
# Start a local network (one of these will work depending on your CLI version):
soroban local network start   # or:  soroban lab run

# Tell the CLI about the local network (RPC URL may vary by version)
soroban config network add local \
  --rpc-url http://localhost:8000 \
  --network-passphrase "Standalone Network ; February 2017"

# Create identities (keypairs) for each role
soroban config identity generate OEM
soroban config identity generate FACTORY
soroban config identity generate QA

# Fund accounts on the local network (airdrop)
soroban account airdrop --identity OEM --network local
soroban account airdrop --identity FACTORY --network local
soroban account airdrop --identity QA --network local
```

### 4) Deploy

```bash
# Deploy the compiled .wasm
CONTRACT_ID=$(soroban contract deploy \
  --wasm $(ls target/*/release/fairfoundry.wasm | head -n1) \
  --network local \
  --source OEM)

echo "Deployed: $CONTRACT_ID"
```

### 5) Initialize

```bash
# Example init (adjust to your types and defaults)
soroban contract invoke --id $CONTRACT_ID --network local --source OEM -- \
  init \
  --oem $(soroban config identity address OEM) \
  --factory $(soroban config identity address FACTORY) \
  --qa $(soroban config identity address QA) \
  --pay_asset "NativeXlm" \
  --pricing '{"price_per_unit":1000000,"defect_penalty_bps":500,"tiers":[{"min_qty":1000,"discount_bps":250}]}' \
  --ers '{"version":1,"max_defect_bps":500,"specs":{}}' \
  --min_escrow_lots 1 \
  --min_qa_stake 100000000 \
  --oem_bond 0 \
  --dispute_window_secs 86400
```

### 6) Try the core flow

Follow the commands in **Example: calling flows with **`` below to deposit escrow, create a lot, commit QA, (optionally) challenge, and settle payment.

## Actors & roles

- **OEM** — deposits escrow, pays factory upon lot acceptance, co‑beneficiary of slashing.
- **Factory** — creates production lots, receives payment.
- **QA** — commits testing metadata, updates pass/fail counts, stakes collateral and may be slashed for missed deadlines.

Roles are fixed at `init` via `Roles { oem, factory, qa }` and are validated with `require_auth` on every mutating call.

## High‑level lifecycle

1. **Initialize** (`init`) with roles, payment asset, pricing, ERS, timelock/oracle config, QA stake & OEM bond requirements.
2. **Fund escrow** (`deposit_escrow`) from OEM in the chosen payment asset (native XLM or a Stellar token).
3. **Create lot** (`create_lot`) by Factory with `{lot_id, quantity}` (bounded by `MAX_LOT_QUANTITY`).
4. **QA commit** (`qa_commit_full`) with:
   - `commit_root` (e.g., Merkle root over test artifacts),
   - `report_uri`,
   - optional serials Merkle root/count,
   - **testbench attestation** `{bench_id, firmware_hash, signer, timestamp}`.
5. **QA progress updates** (`qa_update_counts`) to set `{tested, passed, failed}`. Lot auto‑transitions `Open → InQA → Approved`.
6. **Challenge / re‑inspection (optional)**:
   - Any role may `request_reinspect(lot_id, sample_size, deadline_secs, seed)`.
   - Contract **charges a challenge fee** (default `CHALLENGE_COST_BPS = 10` → 0.1% of lot value) and **rate‑limits** to max 5/hour per address.
   - Deterministic sampler returns unique indices from `[0, quantity)` capped by `MAX_CHALLENGE_SAMPLE`.
   - QA must `qa_reinspect_respond(pass_count, fail_count, proof_hash)` **before** `due_by` or risk default.
   - If QA misses the deadline, anyone may call `challenge_default_slash(slash_bps)` → slashes QA stake (capped by `MAX_SLASH_BPS`, 20%). Slash is split **50% challenger / 50% OEM** and the QA’s locked stake is unlocked.
7. **Settle payment** (`execute_payment`):
   - Enforces oracle freshness if enabled.
   - Computes payment = `passed * price_per_unit` minus tier discounts and a **defect penalty** if defect rate exceeds ERS’s `max_defect_bps`.
   - Debits contract escrow and transfers to Factory. Emits `LotPaid`.

## Commercial logic & parameters

### Payment asset

```rust
AssetKind::{ NativeXlm, StellarAsset(BytesN<32>) }
PaymentAsset { kind, decimals }
```

Used through the Soroban token interface; funds live in the contract account until settlement.

### Pricing & discounts

```rust
Pricing {
  price_per_unit: i128,
  defect_penalty_bps: u32,
  tiers: Vec<DiscountTier{min_qty:u32, discount_bps:u32}>
}
```

- `compute_price_for_lot` applies the **highest** `discount_bps` tier where `passed ≥ min_qty`.
- If actual defect rate (`failed/tested`) **> ERS.max\_defect\_bps**, a penalty is applied: `payment -= payment * defect_penalty_bps / 10_000`.

### ERS (Engineering/Quality spec)

```rust
ERS {
  version: u32,
  max_defect_bps: u32,
  specs: Map<String, u32>
}
```

`specs` holds arbitrary key/value thresholds (e.g., test counts). `propose_ers` queues an update behind a governance timelock (see below).

### Challenges & sampling

- **Cost**: `challenge_cost = lot_value * CHALLENGE_COST_BPS / 10_000`.
  - If OEM is requester, fee is taken from **escrow**; others pay upfront transfer.
- **Locking**: request locks 20% of `min_qa_stake` until resolved.
- **Respond**: timely response refunds the challenge fee to requester.
- **Default / Slash**: on missed deadline, `challenge_default_slash(slash_bps)` splits slash 50/50 to challenger and OEM; capped by `MAX_SLASH_BPS`.
- **Rate limiting**: per‑address `≤5` challenges/hour.
- **Sampler**: `deterministic_sample(quantity, sample_size, seed)` returns up to `MAX_CHALLENGE_SAMPLE` distinct indices.

### Oracle (optional)

```rust
OracleConfig { oracle, quote: Symbol, max_age_secs, enabled, last_price, last_update }
```

- `execute_payment` checks `last_update` against `max_age_secs` when `enabled`.
- `update_oracle_price` requires the `oracle` to `require_auth()`.

## Governance & timelock

```rust
Timelock { eta, approvals: Vec<Address>, executed }
quorum_ok(approvals) => len ≥ 2
MIN_TIMELOCK_DELAY = 3600 seconds
```

- Implemented proposal path: `` enqueues an ERS update with a delay (≥ MIN\_TIMELOCK\_DELAY).
- The code contains generic pending queues for **pricing, roles, and upgrades**, but their apply/approve functions are not included in this file.

## State & storage layout

**Top‑level **`` (stored under key `S`):

- `roles: Roles`
- `pay_asset: PaymentAsset`
- `pricing: Pricing`
- `ers: ERS`
- `oracle: Option<OracleConfig>`
- `min_escrow_lots: u32`
- `escrow_balance: i128`
- **QA staking**: `min_qa_stake, qa_stake, qa_locked_stake, qa_unstake_requests`
- **Stats**: `paused: bool`, totals for produced/approved/challenges
- **Pending updates**: `ers_pending, pricing_pending, roles_pending, upgrade_pending`
- Reentrancy guard: `entered: bool`

**Maps**

- `LOTS: Map<String, Lot>` — `{lot_id, quantity, tested, passed, failed, status, qa_commit, created_at, last_update, pay_nonce, partial_paid_amount, creator}`
- `CHAL: Map<String, Challenge>` — `{requested_by, seed, sample_size, sample_indices, requested_at, due_by, status, cost_paid, response_data}`
- `CHAL_LIMIT: Map<Address, (u64, u32)>` — challenge rate limiting `(last_time, count)`

**Events** `EscrowDeposited`, `EscrowWithdrawn`, `QAStaked`, `QAUnstakeRequested`, `QAUnstaked`, `LotCreated`, `QACommittedFull`, `QAUpdated`, `ReinspectRequested`, `ReinspectResponded`, `ReinspectDefaultSlashed`, `LotPaid`, `ERSProposed`, `OracleUpdated`.

## Security model (what protects funds)

- **Role‑gated mutators** with `Address::require_auth()`; `require_party` restricts to OEM/Factory/QA.
- **Reentrancy guard** (`entered` with `enter/exit`) wraps state‑mutating flows.
- **Safe math** wrappers (`safe_add/sub/mul`) trap on overflow.
- **Bounds & caps**: `MAX_LOT_QUANTITY`, `MAX_CHALLENGE_SAMPLE`, `MAX_SLASH_BPS`.
- **Challenge rate‑limit**: ≤5/hour per address.
- **Oracle freshness**: `OracleStale` error if outdated.
- **Unstake delay**: `QA_UNSTAKE_DELAY = 7 days`; cannot unstake below `min_qa_stake`.

## Public API (summary)

| Function                                                                                                                 | Who can call                               | Effect                                                                              | Emits                     |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------- |
| `init(oem, factory, qa, pay_asset, pricing, ers, min_escrow_lots, oracle?, min_qa_stake, oem_bond, dispute_window_secs)` | OEM & Factory (and QA) must `require_auth` | Bootstraps state                                                                    | `Fairfoundry:init` (log)  |
| `deposit_escrow(from, amount)`                                                                                           | **OEM**                                    | Transfer token → contract; increase `escrow_balance`                                | `EscrowDeposited`         |
| `withdraw_escrow(oem, amount)`                                                                                           | **OEM**                                    | Transfer token ← contract; decrease `escrow_balance`                                | `EscrowWithdrawn`         |
| `stake_qa(qa, amount)`                                                                                                   | **QA**                                     | Transfer token → contract; increase `qa_stake`                                      | `QAStaked`                |
| `request_unstake_qa(qa, amount)`                                                                                         | **QA**                                     | Queue delayed unstake; enforces min stake                                           | `QAUnstakeRequested`      |
| `execute_unstake_qa(qa)`                                                                                                 | **QA**                                     | After delay, transfers available queued amount to QA                                | `QAUnstaked`              |
| `create_lot(factory, lot_id, quantity)`                                                                                  | **Factory**                                | Create `Lot` (requires QA stake ≥ min)                                              | `LotCreated`              |
| `qa_commit_full(qa, lot_id, commit_root, report_uri, serials_root, serials_count, bench_id, firmware_hash, signer)`      | **QA**                                     | Attach QA metadata; set status `InQA`                                               | `QACommittedFull`         |
| `qa_update_counts(qa, lot_id, tested, passed, failed)`                                                                   | **QA**                                     | Update counts; auto `Approved` when `tested == quantity`                            | `QAUpdated`               |
| `request_reinspect(requester, lot_id, sample_size, deadline_secs, seed)`                                                 | OEM/Factory/QA                             | Charge fee, lock QA stake, store challenge & sample indices                         | `ReinspectRequested`      |
| `qa_reinspect_respond(qa, lot_id, pass_count, fail_count, proof_hash)`                                                   | **QA**                                     | Record response; refund fee if timely; unlock QA lock                               | `ReinspectResponded`      |
| `challenge_default_slash(caller, lot_id, slash_bps)`                                                                     | Any role                                   | If overdue, slash QA stake (≤20%); split to challenger & OEM                        | `ReinspectDefaultSlashed` |
| `execute_payment(lot_id)`                                                                                                | Any role                                   | Transfer escrow → Factory; apply discounts & defect penalty; fail if open challenge | `LotPaid`                 |
| `propose_ers(caller, ers, delay_secs)`                                                                                   | Any role                                   | Queue ERS update with timelock (≥1h)                                                | `ERSProposed`             |
| `update_oracle_price(oracle, price)`                                                                                     | **Oracle signer**                          | Update oracle price and timestamp                                                   | `OracleUpdated`           |
| `view_state()` / `view_lot(lot_id)` / `view_challenge(lot_id)` / `view_analytics()`                                      | Anyone                                     | Read‑only views                                                                     | —                         |

> **Note:** The file defines pending queues for pricing/roles/upgrades but only `propose_ers` is wired. Additional approve/execute methods would be needed to complete governance for those queues.

## Invariants & failure modes

- `tested == passed + failed` must hold; otherwise `InvalidCounts`.
- Payment path rejects if: (a) QA stake < min, (b) oracle stale (when enabled), (c) there’s an **open** challenge for the lot.
- Challenge request fails if not rate‑limited, fee can’t be collected, or sample size > `MAX_CHALLENGE_SAMPLE`.
- Withdrawals/unstakes that would underflow balances revert with `Overflow`/`Insufficient*` errors.

## Example: calling flows with `soroban-cli`

```bash
# Addresses (example placeholders)
OEM=G...OEM   FACTORY=G...FACT   QA=G...QA   ORACLE=G...ORAC
CONTRACT=CA...CTID

# Deposit escrow (OEM)
soroban contract invoke \
  --id $CONTRACT \
  --source $OEM \
  -- \
  deposit_escrow \
  --from $OEM \
  --amount 1000000000     # 1,000 units in token’s minor units

# Factory creates a lot
soroban contract invoke --id $CONTRACT --source $FACTORY -- \
  create_lot --factory $FACTORY --lot_id L23-042 --quantity 5000

# QA commits metadata
soroban contract invoke --id $CONTRACT --source $QA -- \
  qa_commit_full --qa $QA --lot_id L23-042 \
  --commit_root 0x... --report_uri ipfs://... \
  --serials_root 0x... --serials_count 5000 \
  --bench_id TB-01 --firmware_hash 0x... --signer $QA

# Request re‑inspection (OEM)
soroban contract invoke --id $CONTRACT --source $OEM -- \
  request_reinspect --requester $OEM --lot_id L23-042 \
  --sample_size 100 --response_deadline_secs 86400 --seed 0x...

# QA responds
soroban contract invoke --id $CONTRACT --source $QA -- \
  qa_reinspect_respond --qa $QA --lot_id L23-042 \
  --pass_count 98 --fail_count 2 --proof_hash 0x...

# Execute payment
soroban contract invoke --id $CONTRACT --source $OEM -- \
  execute_payment --lot_id L23-042
```

## Visual state diagram



## ASCII state sketch

```
Open ──(qa_commit_full)──▶ InQA ──(qa_update_counts until tested==quantity)──▶ Approved
  │                                  │                    │
  └────────(request_reinspect)───────┴─▶ Challenge(Open)──┴─▶ Responded/Expired
                                                          │
                                              (no Open challenge) ──▶ Paid/Closed
```

## Known limitations & TODOs

- Governance queues exist for **pricing/roles/upgrades** but only ERS has a proposer. Add approve/execute paths.
- `paused` flag is present but not exposed here; add pause/unpause admin gated by timelock.
- `batch_create_lots` is a stub (pushes IDs only) — wire it to `create_lot` with proper checks.
- Consider allowing **partial payments** per milestone (the field `partial_paid_amount` exists but isn’t exercised).
- Add events for more governance operations once implemented.

## Error codes (selected)

`NotAuthorized`, `InvalidState`, `InsufficientEscrow`, `InvalidCounts`, `NotFound`, `AlreadyExists`, `TimelockActive`, `AlreadyExecuted`, `OracleStale`, `Param`, `TooEarlyOrLate`, `Reentrancy`, `NoChallenge`, `Overflow`, `InvalidProof`, `ChallengeLimitExceeded`, `InsufficientStake`, `UnstakePending`.

## Testing checklist

- Role auth gates on every mutator (`require_auth`).
- Escrow invariants: sum(outgoing payments + withdrawal) ≤ deposits.
- QA staking: cannot unstake below `min_qa_stake`; lock/unlock around challenges; delay respected.
- Challenge flow: fee assessed/refunded; rate limiting; sampler uniqueness; default → slash split and caps.
- Payment math: tiers apply correctly; defect penalty triggers only when threshold exceeded; oracle freshness enforced.
- Reentrancy: `entered` toggles correctly on all paths (including early returns).

---

**Security note**: This contract has not been audited. Review, fuzz, and formally verify critical paths (escrow transfers, challenge/slash, settlement math) before mainnet deployment.

