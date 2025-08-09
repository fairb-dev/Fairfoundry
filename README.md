# Fairfoundry

Fairfoundry is a **research and demonstration** Soroban smart contract for **precision component manufacturing** — optics, sensors, lasers, mechatronics, and more — where trust, quality assurance, and transparent settlement are essential.

Built on the Stellar blockchain (XLM) using Soroban smart contracts, Fairfoundry showcases how escrowed micro-transactions, third-party QA, and bilateral governance can be combined in a supply chain context.

⚠️ **Non-commercial license:** This project is licensed under Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0). It is for educational, testing, and demonstration purposes only. **No production or commercial use is permitted** without prior written permission from the authors.

---

## Purpose

Fairfoundry is intended as a **reference implementation** for:
- Multi-party escrow in manufacturing environments
- QA-verified payment triggers
- Governance with quorum and timelocks
- Data exhaust for analytics and machine learning

It is **not** intended for deployment in production systems.

---

## Architecture

**Roles**
- **OEM** – Buyer funding escrow for manufactured components
- **Factory** – Manufacturer creating production lots
- **QA Provider** – Independent third-party performing quality checks

**Core Data Structures**
- **State** – Roles, payment asset, pricing tiers, ERS quality thresholds, escrow/stake balances, governance queues
- **Lot** – Per-lot lifecycle from creation to settlement
- **Governance** – 2-of-3 approvals with timelocks for ERS, pricing, and pause/unpause

**Risk Controls**
- Escrow coverage requirements
- QA staking with slashing on disputes
- Partial payouts with caps
- Defect penalties and volume discounts

---

## Key Features (Demonstration Only)

- **Escrow & Payouts**
  - Asset-agnostic: Native XLM or any Stellar Asset Contract (SAC) token
  - Lot-based micro-transactions with final and partial settlements

- **QA Integration**
  - Commit-reveal scheme with Merkle root and off-chain report URI
  - Real-time tested/passed/failed counts

- **Governance**
  - 2-of-3 role approval with timelock before execution
  - Pause/unpause capability

- **Dispute Resolution**
  - OEM can open disputes on approved lots
  - 2-of-3 resolution: pay factory with penalty or refund OEM, with optional QA slashing

---

## Events for Analytics

Fairfoundry emits clean, structured events suitable for warehousing and ML experimentation:
- `EscrowDeposited`, `EscrowWithdrawn`
- `QAStaked`, `LotCreated`, `QACommitted`, `QAUpdated`
- `LotDisputed`, `DisputeResolved`
- `LotPartialPaid`, `LotPaid`
- `ERSProposed`, `ERSUpdated`
- `PricingProposed`, `PricingUpdated`
- `Paused`, `Unpaused`

---

## Quickstart (Testnet Only)

> This is an **educational example**. Do not deploy to mainnet for commercial use.

```bash
# Build
soroban contract build

# Deploy to testnet
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/fairfoundry.wasm \
  --network testnet \
  --source <DEPLOYER>)

echo "Deployed: $CONTRACT_ID"

# Init example
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
     --min_escrow_lots 2
