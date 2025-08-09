# Fairfoundry

Fairfoundry is a **Soroban smart contract on Stellar (XLM)** for high-value, high-volume manufacturing where **fairness, QA integrity, and continuous settlement** are critical. It supports **micro-transactional payouts per production lot**, **independent QA (Fairbuild)**, and **timelocked 2-of-3 governance** for pricing and ERS changes.

> **Status:** Research & demonstration only. Licensed **CC BY-NC 4.0** — not for commercial use without prior written permission.

---

## Visual Overview

Below are diagrams that summarize the system and flows. All SVGs have been validated as well‑formed XML.

**Validation summary**
- fairfoundry_architecture.svg: OK (width=1100, height=560, viewBox=0 0 1100 560)
- fairfoundry_state_machine.svg: OK (width=1100, height=420, viewBox=0 0 1100 420)
- fairfoundry_settlement_timing.svg: OK (width=1100, height=260, viewBox=0 0 1100 260)
- fairfoundry_reinspection_sequence.svg: OK (width=1100, height=640, viewBox=0 0 1100 640)
- fairfoundry_data_model.svg: OK (width=1100, height=420, viewBox=0 0 1100 420)
- fairfoundry_payment_pipeline.svg: OK (width=1100, height=320, viewBox=0 0 1100 320)
- fairfoundry_governance_timelock.svg: OK (width=1100, height=260, viewBox=0 0 1100 260)

### Architecture
![fairfoundry_architecture.svg](assets/fairfoundry_architecture.svg)

### Lot Lifecycle
![fairfoundry_state_machine.svg](assets/fairfoundry_state_machine.svg)

### Settlement Timing (Micro‑Transactions)
![fairfoundry_settlement_timing.svg](assets/fairfoundry_settlement_timing.svg)

### Re‑inspection Challenge (Sequence)
![fairfoundry_reinspection_sequence.svg](assets/fairfoundry_reinspection_sequence.svg)

### Data Model
![fairfoundry_data_model.svg](assets/fairfoundry_data_model.svg)

### Payment Pipeline
![fairfoundry_payment_pipeline.svg](assets/fairfoundry_payment_pipeline.svg)

### Governance (2‑of‑3 + Timelock)
![fairfoundry_governance_timelock.svg](assets/fairfoundry_governance_timelock.svg)

---

## Why this contract reduces risk

- **Frequent micro‑settlements** → smaller exposure, faster feedback.
- **Objective QA** with stake + slashing → economic incentive for fair testing.
- **Deterministic re‑inspection** on **committed unit serials** → verify quality with low overhead.
- **Bilateral change control** via **2‑of‑3 timelocked governance** → no unilateral rule changes.
- **Transparent events** → a clean audit trail suitable for analytics and ML.

---

## Fairness & QA Integrity

- **Testbench attestation** (`bench_id`, `firmware_hash`, `signer`) per lot.
- **Serial‑number commitments** (Merkle root + count) to prevent omission/double‑counting.
- **Re‑inspection flow**: `request_reinspect(seed, sample_size, deadline)` → indices published on‑chain.  
  `qa_reinspect_respond(...)` must arrive before `due_by`, otherwise `challenge_default_slash(...)` allows stake slashing.
- **QA‑only updates for counts/commitments**; payment is gated on `Approved` state or dispute outcome.

---

## Security & Risk Mitigation

- **Auth boundaries**: QA posts results; OEM funds escrow; governance requires quorum.
- **Economic safety**: **QA stake** (must meet minimum before lots/payouts) and **OEM bond** (slashable for bad‑faith disputes).
- **Payment safety**: idempotent final settlement, capped partial payouts, volume discounts, and defect penalties when ERS is exceeded.
- **Operational safety**: reentrancy guard, bounds checks, and 2‑party **pause/unpause** for incident response.
- **Asset‑agnostic payouts** via Stellar Asset Contract (SAC); examples use native XLM.

> **Note:** Merkle inclusion proof verification is intentionally left for future optimization; commitments + deadlines + staking economics provide current guarantees with low compute cost.

---

## Events (as emitted by the contract)

- `EscrowDeposited`, `EscrowWithdrawn`  
- `QAStaked`  
- `LotCreated`, `QACommitted`, `QAUpdated`  
- `SerialsCommitted`, `AttestationCommitted`  
- `ReinspectRequested`, `ReinspectResponded`, `ReinspectDefaultSlashed`  
- `LotDisputed`, `DisputeResolved`  
- `LotPartialPaid`, `LotPaid`  
- `ERSProposed`, `ERSUpdated`, `PricingProposed`, `PricingUpdated`  
- `Paused`, `Unpaused`

---

## Quickstart (Testnet only)

```bash
# Build
soroban contract build

# Deploy (example)
CONTRACT_ID=$(soroban contract deploy   --wasm target/wasm32-unknown-unknown/release/fairfoundry.wasm   --network testnet   --source <DEPLOYER>)

# Initialize (example)
soroban contract invoke   --id $CONTRACT_ID   --fn init   -- --oem <OEM_ADDR> --factory <FACTORY_ADDR> --qa <QA_ADDR>      --pay_asset.kind NativeXlm --pay_asset.decimals 7      --pricing.price_per_unit 1000000      --pricing.defect_penalty_bps 100      --pricing.tiers '[{"min_qty":1000,"discount_bps":50}]'      --ers.version 1 --ers.max_defect_bps 300      --ers.specs '{"MTF":400,"SNR":35}'      --min_escrow_lots 2      --min_qa_stake 500000000      --oem_bond 300000000      --dispute_window_secs 86400
```

---

## Repository Layout

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

**Creative Commons Attribution‑NonCommercial 4.0 International (CC BY‑NC 4.0).**  
See [LICENSE](./LICENSE) for details.
