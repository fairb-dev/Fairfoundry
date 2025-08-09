# Fairfoundry

Fairfoundry is a **Soroban smart contract on Stellar (XLM)** for high‑value, high‑volume manufacturing where **fairness, quality assurance, and continuous settlement** matter. It enables **micro‑transactional payouts per production lot**, **third‑party QA verification (Fairbuild)**, and **governed updates** to pricing and engineering requirements — all under a **non‑commercial license (CC BY‑NC 4.0)**.

> **Status:** Research & demonstration only. Do **not** use for production or commercial deployment without prior written permission.


---

## Why Fairfoundry?

Traditional two‑party PO flows (OEM ↔ Factory) carry **large exposure** and **slow feedback**. Fairfoundry reduces risk by:
- **Frequent micro‑settlements** per lot → smaller exposure, steady cashflow, faster detection of quality drift.
- **Independent QA** with skin‑in‑the‑game (stake + slashing) → objective, auditable results.
- **Deterministic re‑inspection** challenges on unit serials → verify lots with low overhead.
- **Bilateral governance** (2‑of‑3 with timelocks) → no unilateral term changes.
- **Transparent events** → clean data exhaust for analytics and ML.

---

## Architecture

<img alt="Fairfoundry Architecture" src="assets/fairfoundry_architecture.svg" width="960"/>

**Roles**
- **OEM** — funds escrow, can dispute or request re‑inspection
- **Factory** — creates production lots, receives payouts
- **QA Provider (Fairbuild)** — posts QA results/serials/attestations, maintains stake

**Contract sub‑systems**
- **Escrow & payouts** (XLM or any SAC token), volume discounts, defect penalties
- **QA commitments**: results Merkle root, **serials Merkle root**, **testbench attestation**
- **Re‑inspection**: deterministic sampling with deadlines and slashing on default
- **Governance**: 2‑of‑3 approvals with timelocks for ERS, pricing, and role rotation
- **Safety**: pause/unpause, reentrancy guard, bounds checks

---

## Lot Lifecycle

<img alt="Fairfoundry Lot State Machine" src="assets/fairfoundry_state_machine.svg" width="960"/>

`Open → InQA → Approved → (Disputed?) → Paid / Refunded → Closed`

- QA updates tested/passed/failed in real time.
- Payment only executes in **Approved** state (or through dispute resolution).

---

## Settlement Timing (Micro‑Transactions)

<img alt="Fairfoundry Settlement Timing" src="assets/fairfoundry_settlement_timing.svg" width="960"/>

- Lots settle independently; only the value of **one lot** is at risk at any time.
- OEM capital isn’t locked for weeks; factories get steady cashflow.

---

## QA Integrity

**How we keep testing fair, auditable, and low‑overhead:**

1. **Testbench Attestation**  
   QA records `bench_id`, `firmware_hash`, and `signer` for each lot.

2. **Unit Serial Commitments**  
   QA commits a **Merkle root** over the set of unit serials and a `serials_count` to prevent omissions and enable sampling proofs.

3. **Deterministic Re‑inspection**  
   Any party (OEM/Factory) can call `request_reinspect(seed, size, deadline)` to select a **deterministic random sample** of serial indices.  
   QA must respond before `due_by` with `qa_reinspect_respond(...)`. Missing the deadline allows **stake slashing** via `challenge_default_slash(...)`.

**Sequence**
<img alt="Reinspection Sequence" src="assets/fairfoundry_reinspection_sequence.svg" width="960"/>

---

## Data Model & Payment Pipeline

**Data Model**
<img alt="Data Model" src="assets/fairfoundry_data_model.svg" width="960"/>

**Payment Pipeline**
<img alt="Payment Pipeline" src="assets/fairfoundry_payment_pipeline.svg" width="960"/>

**Highlights**
- **Entitlement =** passed units × price, minus volume discount, minus defect penalty (if defect_bps > ERS threshold), minus prior partial payouts.  
- Final settlement is **idempotent** — repeated calls pay zero once closed/paid.

---

## Governance (Fairness & Change Control)

<img alt="Governance Timelock" src="assets/fairfoundry_governance_timelock.svg" width="960"/>

- **2‑of‑3 quorum** across OEM, Factory, QA.
- **Timelock** ensures changes (ERS/pricing/roles) aren’t rushed and can be reviewed.
- **Role rotation** enables key hygiene without redeploying the contract.

---

## Security Posture

- **Auth boundaries**: only QA may post test counts/commits; only OEM funds escrow; governed updates require quorum.
- **Economic security**: **QA stake** (min required for lot creation and payout) and **OEM performance bond** (slashable for bad‑faith disputes).
- **Reentrancy guard** and **bounds checks** on payments and counts.
- **Pause/Unpause** requires 2 distinct parties (2‑of‑3) for incident response.
- **Auditability**: strong event model; commit‑and‑prove approach for QA artifacts.
- **Asset‑agnostic** payouts using Stellar Asset Contract (SAC); default examples use native XLM.

> **Note:** Merkle inclusion proof verification is intentionally left as a future optimization; the contract currently enforces via commitments, deadlines, and staking economics to keep gas and code size in check.

---

## Events (for analytics & ML)

- `EscrowDeposited`, `EscrowWithdrawn`  
- `QAStaked`  
- `LotCreated`, `QACommitted`, `QAUpdated`  
- `SerialsCommitted`, `AttestationCommitted`  
- `ReinspectRequested`, `ReinspectResponded`, `ReinspectDefaultSlashed`  
- `LotDisputed`, `DisputeResolved`  
- `LotPartialPaid`, `LotPaid`  
- `ERSProposed`, `ERSUpdated`, `PricingProposed`, `PricingUpdated`, `RolesProposed/Approved/Executed`  
- `Paused`, `Unpaused`

**ML hooks:** these events make great features for **drift detection**, **QA performance scoring**, **payment risk scoring**, and **anomaly detection** across suppliers.


---

## Quickstart (Testnet only)

> This is an **educational example**. Do not deploy to mainnet for commercial use.

```bash
# Build
soroban contract build

# Deploy (example)
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/fairfoundry.wasm \
  --network testnet \
  --source <DEPLOYER>)
echo "Deployed: $CONTRACT_ID"

# Init (example)
soroban contract invoke \
  --id $CONTRACT_ID \
  --fn init \
  -- --oem <OEM_ADDR> --factory <FACTORY_ADDR> --qa <QA_ADDR> \
     --pay_asset.kind NativeXlm --pay_asset.decimals 7 \
     --pricing.price_per_unit 1000000 \
     --pricing.defect_penalty_bps 100 \
     --pricing.tiers '[{"min_qty":1000,"discount_bps":50}]' \
     --ers.version 1 --ers.max_defect_bps 300 \
     --ers.specs '{"MTF":400,"SNR":35}' \
     --min_escrow_lots 2 \
     --min_qa_stake 500000000 \
     --oem_bond 300000000 \
     --dispute_window_secs 86400
```

---

## Core API (selected)

**Escrow & Stake**
- `deposit_escrow(oem, amount)` — fund OEM escrow
- `withdraw_escrow(oem, amount)` — withdraw if unused
- `stake_qa(qa, amount)` — QA stake; must meet `min_qa_stake`

**Lots & QA**
- `create_lot(factory, lot_id, qty)`
- `qa_commit(qa, lot_id, commit_root, report_uri)`
- `qa_commit_serials(qa, lot_id, serials_root, serials_count)`
- `qa_commit_attestation(qa, lot_id, bench_id, firmware_hash, signer)`
- `qa_update_counts(qa, lot_id, tested, passed, failed)`

**Re‑inspection & Disputes**
- `request_reinspect(requester, lot_id, sample_size, deadline_secs, seed) -> Vec<u32>`
- `qa_reinspect_respond(qa, lot_id, pass_count, fail_count)`
- `challenge_default_slash(caller, lot_id, slash_bps)`
- `dispute_open(oem, lot_id)` / `dispute_resolve(caller, lot_id, pay_factory, penalty_bps)`

**Settlement**
- `partial_payout(caller, lot_id, amount)`
- `execute_payment(lot_id) -> i128` (idempotent)

**Governance**
- `propose_* / approve_* / execute_*` for **ERS**, **pricing**, and **roles**
- `pause(a, b)` / `unpause(a, b)`

**Views**
- `view_state()` / `view_lot(lot_id)`
- `view_lot_counts()` / `view_defect_stats()`

---

## Running Tests

```
cargo test
```

- **Integration flows:** `tests/flows.rs` (happy path, disputes, re‑inspection, role rotation)  
- **Invariants:** `tests/invariants.rs` (escrow non‑negative, stake floors, idempotent settlement)

---

## Repository

```
.
├── contracts/
│   └── fairfoundry.rs
├── assets/
│   ├── fairfoundry_architecture.svg
│   ├── fairfoundry_state_machine.svg
│   ├── fairfoundry_settlement_timing.svg
│   ├── fairfoundry_reinspection_sequence.svg
│   ├── fairfoundry_data_model.svg
│   ├── fairfoundry_payment_pipeline.svg
│   └── fairfoundry_governance_timelock.svg
├── tests/
│   ├── flows.rs
│   └── invariants.rs
├── README.md
└── LICENSE
```

---

## License

This work is licensed under **Creative Commons Attribution‑NonCommercial 4.0 International (CC BY‑NC 4.0)**. See [LICENSE](./LICENSE) for details.
