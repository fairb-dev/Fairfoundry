# Fairfoundry

Fairfoundry is a **research and demonstration** Soroban smart contract for **precision component manufacturing** — optics, sensors, lasers, mechatronics, and other applications where safety, quality assurance, and transparent settlement are essential.

Built on the Stellar blockchain (XLM) using Soroban smart contracts, Fairfoundry showcases how escrowed micro-transactions, third-party QA, and bilateral governance can be combined in a supply chain context.

> ⚠ **Non-commercial license:** Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0). Educational, testing, and demonstration use only. **No production or commercial use** without prior written permission.

---

## Architecture

<img alt="Fairfoundry Architecture" src="assets/fairfoundry_architecture.svg" width="960"/>

**Roles**
- **OEM** – Buyer funding escrow for manufactured components  
- **Factory** – Manufacturer creating production lots  
- **QA Provider** – Independent third-party performing quality checks

**Core Data Structures**
- **State** – Roles, payment asset, pricing tiers, ERS thresholds, escrow/stake balances, governance queues  
- **Lot** – Per-lot lifecycle from creation to settlement  
- **QA Data** – Testbench attestation, unit serial Merkle root, total units tested  
- **Governance** – 2-of-3 approvals + timelocks for ERS/pricing/pause/unpause

---

## Lot Lifecycle

<img alt="Fairfoundry Lot State Machine" src="assets/fairfoundry_state_machine.svg" width="960"/>

`Open → InQA → Approved → (Disputed?) → Paid / Refunded → Closed`

- QA posts results; **payments require Approved**.  
- **Disputes** and **re-inspection** flows enforce fairness without giving any one party unilateral power.

---

## Settlement Timing (Micro-Transactions)

<img alt="Fairfoundry Settlement Timing" src="assets/fairfoundry_settlement_timing.svg" width="960"/>

Frequent, small, low-overhead settlements reduce exposure, speed feedback, and smooth factory cashflow.

---

## QA Integrity Features

1) **Testbench Attestation**  
QA records **bench_id**, **firmware_hash**, and **signer** per lot.

2) **Unit Serial Commitments**  
QA commits a **Merkle root** over unit serials (+ count) to prevent omission/double-counting and enable sampling proofs.

3) **Randomized Re-inspection Challenges**  
OEM or Factory requests a deterministic random sample; QA must respond before a deadline or risk **stake slashing**.

**APIs**:
- `qa_commit(...)` → results commitment + report URI  
- `qa_commit_serials(serials_root, serials_count)`  
- `qa_commit_attestation(bench_id, firmware_hash, signer)`  
- `request_reinspect(requester, lot_id, sample_size, response_deadline_secs, seed) -> Vec<u32>`  
- `qa_reinspect_respond(lot_id, pass_count, fail_count)`  
- `challenge_default_slash(lot_id, slash_bps)`

---

## Risk Controls

- **Escrow coverage** floor for lot creation  
- **QA staking + slashing** for misreporting or missed challenges  
- **OEM performance bond** for bad-faith disputes (slashable on resolution)  
- **Partial payouts** (capped by passed units minus prior partials)  
- **Defect penalties** and **volume discounts** auto-applied  
- **2-of-3 timelocked governance** for ERS/pricing/roles/pause

---

## Events (for Analytics/ML)

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

## Quickstart (testnet only)

> This is an **educational example**. Do not deploy to mainnet for commercial use.

```bash
# Build
soroban contract build

# Deploy
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

