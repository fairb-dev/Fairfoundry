# Contributing to Fairfoundry

Thank you for your interest in contributing to Fairfoundry.

## Prerequisites

- **Rust** (stable toolchain, 1.84.0+)
- **Wasm target**: `rustup target add wasm32-unknown-unknown`
- **soroban-cli** (optional, for deployment): `cargo install --locked soroban-cli`

## Project structure

```
Fairfoundry/
  Cargo.toml                        # Workspace root
  contracts/fairfoundry/
    Cargo.toml                      # Crate manifest (soroban-sdk)
    src/
      lib.rs                        # Contract implementation
      test/
        mod.rs                      # Test module root
        flows.rs                    # Integration flow tests (happy paths)
        invariants.rs               # Multi-lot invariant tests
        negative.rs                 # Auth failures, bad params, wrong-state transitions
        properties.rs               # Conservation laws and formula verification
        scenarios.rs                # End-to-end multi-step scenarios
```

When adding tests, place them in the module that best matches their intent:

- **flows.rs** — full lifecycle happy-path tests
- **negative.rs** — `#[should_panic]` tests for error paths
- **properties.rs** — invariant / conservation-law assertions
- **scenarios.rs** — multi-step integration scenarios (oracle, governance, unstake, etc.)
- **invariants.rs** — cross-operation invariant checks with challenges

## Building

```bash
# From repo root
cargo build --target wasm32-unknown-unknown --release
```

The compiled `.wasm` artifact is emitted to `target/wasm32-unknown-unknown/release/fairfoundry.wasm`.

## Running tests

```bash
cargo test

# With output for debugging
cargo test -- --nocapture

# Run a single test by name
cargo test multi_lot_pipeline
```

## Code style

This project uses `rustfmt` and `clippy` with the settings in `rustfmt.toml` and `clippy.toml`.

```bash
# Format
cargo fmt --all

# Lint
cargo clippy --all-targets
```

Please run both before opening a PR. CI will reject unformatted or clippy-warned code.

## Commit messages

Use short, imperative-mood subjects that describe the change:

```
Add oracle staleness test for execute_payment
Fix challenge cost formula when lot.passed is zero
Remove unused batch_create_lots stub
```

Prefix with a scope when helpful: `test:`, `docs:`, `ci:`, `fix:`, `feat:`.

## Branch naming

Use descriptive kebab-case branches off `main`:

```
feat/partial-payments
fix/slash-overflow
test/governance-timelock
```

## Pull request process

1. Fork the repo and create a feature branch from `main`.
2. Make your changes and add tests for new functionality.
3. Run `cargo fmt --all`, `cargo clippy --all-targets`, and `cargo test` locally.
4. Open a PR with a clear description of the change and its motivation.
5. Address review feedback.

## License

This project is licensed under **CC BY-NC 4.0**. By contributing, you agree that your
contributions will be released under the same license.
