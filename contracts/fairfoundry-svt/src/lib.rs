//! # Fairfoundry SVT — Service Validation Token
//!
//! A Soroban token contract for non-transferable (soulbound) Service Validation
//! Tokens. Each SVT represents a validated manufacturing service completion,
//! attested by the FairBuild oracle.
//!
//! ## Design
//!
//! - **Mint authority**: Only the Fairfoundry settlement contract can mint.
//! - **Non-transferable**: SVTs cannot be transferred between addresses.
//!   They are bound to the manufacturing partner (factory) that performed
//!   the service.
//! - **Metadata**: Each SVT carries the service order ID, development stage,
//!   and attestation timestamp.
//! - **Queryable**: Anyone can verify SVT existence and metadata on-chain.

#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short, Address,
    Env, Map, String, Symbol,
};

// ============================ Errors ============================

#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SvtErr {
    /// Caller is not the authorized minter (settlement contract).
    NotAuthorized = 1,
    /// SVT with this ID already exists.
    AlreadyExists = 2,
    /// SVT not found.
    NotFound = 3,
    /// Transfer attempted — SVTs are non-transferable.
    NonTransferable = 4,
    /// Contract already initialized.
    AlreadyInitialized = 5,
}

// ============================ Types ============================

/// Development stage mirroring the settlement contract's ServiceStage.
#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum SvtStage {
    EVT,
    DVT,
    PVT,
    MP,
    Sustaining,
}

/// Metadata stored with each SVT.
#[derive(Clone)]
#[contracttype]
pub struct SvtMetadata {
    /// The SVT numeric ID.
    pub svt_id: u64,
    /// The service order this SVT validates.
    pub order_id: String,
    /// Development stage of the service.
    pub stage: SvtStage,
    /// Address of the manufacturing partner who earned this SVT.
    pub recipient: Address,
    /// Address of the oracle that attested completion.
    pub attested_by: Address,
    /// Timestamp when the SVT was minted.
    pub minted_at: u64,
}

/// Contract state.
#[derive(Clone)]
#[contracttype]
pub struct SvtState {
    /// The settlement contract authorized to mint SVTs.
    pub minter: Address,
    /// Admin who initialized the contract.
    pub admin: Address,
    /// Total SVTs minted.
    pub total_minted: u64,
}

// =========================== Storage Keys =======================

const STATE: Symbol = symbol_short!("STATE");
const TOKENS: Symbol = symbol_short!("TOKENS");
const BY_OWNER: Symbol = symbol_short!("BYOWNER");

fn now(env: &Env) -> u64 {
    env.ledger().timestamp()
}

// =========================== Contract ===========================

#[contract]
pub struct FairfoundrySvt;

#[contractimpl]
impl FairfoundrySvt {
    /// Initializes the SVT contract with the authorized minter (settlement contract).
    ///
    /// # Arguments
    /// * `admin` - Admin address (must authorize)
    /// * `minter` - The Fairfoundry settlement contract address authorized to mint
    pub fn init(env: Env, admin: Address, minter: Address) {
        admin.require_auth();

        if env.storage().persistent().has(&STATE) {
            panic_with_error!(&env, SvtErr::AlreadyInitialized);
        }

        let state = SvtState {
            minter,
            admin,
            total_minted: 0,
        };

        env.storage().persistent().set(&STATE, &state);
        env.storage()
            .persistent()
            .set(&TOKENS, &Map::<u64, SvtMetadata>::new(&env));
        env.storage()
            .persistent()
            .set(&BY_OWNER, &Map::<Address, u64>::new(&env));
    }

    /// Mints a new SVT. Only the authorized minter (settlement contract) may call this.
    ///
    /// # Arguments
    /// * `svt_id` - Unique SVT ID (assigned by settlement contract)
    /// * `order_id` - Service order this SVT validates
    /// * `stage` - Development stage
    /// * `recipient` - Manufacturing partner address
    /// * `attested_by` - Oracle address that attested completion
    ///
    /// # Events
    /// * `SVTMinted(svt_id, recipient, order_id, timestamp)`
    pub fn mint(
        env: Env,
        svt_id: u64,
        order_id: String,
        stage: SvtStage,
        recipient: Address,
        attested_by: Address,
    ) {
        let mut state: SvtState = env.storage().persistent().get(&STATE).unwrap();

        // Only the settlement contract can mint
        state.minter.require_auth();

        let mut tokens: Map<u64, SvtMetadata> = env.storage().persistent().get(&TOKENS).unwrap();
        if tokens.contains_key(svt_id) {
            panic_with_error!(&env, SvtErr::AlreadyExists);
        }

        let meta = SvtMetadata {
            svt_id,
            order_id: order_id.clone(),
            stage,
            recipient: recipient.clone(),
            attested_by,
            minted_at: now(&env),
        };

        tokens.set(svt_id, meta);
        env.storage().persistent().set(&TOKENS, &tokens);

        // Track owner's SVT count
        let mut by_owner: Map<Address, u64> = env.storage().persistent().get(&BY_OWNER).unwrap();
        let count = by_owner.get(recipient.clone()).unwrap_or(0);
        by_owner.set(recipient.clone(), count + 1);
        env.storage().persistent().set(&BY_OWNER, &by_owner);

        state.total_minted += 1;
        env.storage().persistent().set(&STATE, &state);

        env.events().publish(
            (Symbol::new(&env, "SVTMinted"), svt_id),
            (recipient, order_id, now(&env)),
        );
    }

    /// Returns the metadata for a specific SVT.
    pub fn view_svt(env: Env, svt_id: u64) -> SvtMetadata {
        let tokens: Map<u64, SvtMetadata> = env.storage().persistent().get(&TOKENS).unwrap();
        tokens
            .get(svt_id)
            .unwrap_or_else(|| panic_with_error!(&env, SvtErr::NotFound))
    }

    /// Returns the number of SVTs held by an address.
    pub fn balance_of(env: Env, owner: Address) -> u64 {
        let by_owner: Map<Address, u64> = env.storage().persistent().get(&BY_OWNER).unwrap();
        by_owner.get(owner).unwrap_or(0)
    }

    /// Returns the total number of SVTs minted.
    pub fn total_supply(env: Env) -> u64 {
        let state: SvtState = env.storage().persistent().get(&STATE).unwrap();
        state.total_minted
    }

    /// Returns the contract state.
    pub fn view_state(env: Env) -> SvtState {
        env.storage().persistent().get(&STATE).unwrap()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    #[test]
    fn mint_and_query() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let minter = Address::generate(&env);
        let factory = Address::generate(&env);
        let oracle = Address::generate(&env);

        let contract_id = env.register(FairfoundrySvt, ());
        let client = FairfoundrySvtClient::new(&env, &contract_id);

        client.init(&admin, &minter);

        let order_id = String::from_str(&env, "SVC-001");
        client.mint(&1u64, &order_id, &SvtStage::EVT, &factory, &oracle);

        let meta = client.view_svt(&1u64);
        assert_eq!(meta.svt_id, 1);
        assert_eq!(meta.recipient, factory);
        assert_eq!(meta.stage, SvtStage::EVT);

        assert_eq!(client.balance_of(&factory), 1);
        assert_eq!(client.total_supply(), 1);
    }

    #[test]
    fn multiple_mints_same_owner() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let minter = Address::generate(&env);
        let factory = Address::generate(&env);
        let oracle = Address::generate(&env);

        let contract_id = env.register(FairfoundrySvt, ());
        let client = FairfoundrySvtClient::new(&env, &contract_id);

        client.init(&admin, &minter);

        client.mint(
            &1u64,
            &String::from_str(&env, "SVC-001"),
            &SvtStage::EVT,
            &factory,
            &oracle,
        );
        client.mint(
            &2u64,
            &String::from_str(&env, "SVC-002"),
            &SvtStage::DVT,
            &factory,
            &oracle,
        );
        client.mint(
            &3u64,
            &String::from_str(&env, "SVC-003"),
            &SvtStage::PVT,
            &factory,
            &oracle,
        );

        assert_eq!(client.balance_of(&factory), 3);
        assert_eq!(client.total_supply(), 3);

        let meta = client.view_svt(&2u64);
        assert_eq!(meta.stage, SvtStage::DVT);
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #2)")]
    fn duplicate_svt_id_fails() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let minter = Address::generate(&env);
        let factory = Address::generate(&env);
        let oracle = Address::generate(&env);

        let contract_id = env.register(FairfoundrySvt, ());
        let client = FairfoundrySvtClient::new(&env, &contract_id);

        client.init(&admin, &minter);

        let order_id = String::from_str(&env, "SVC-001");
        client.mint(&1u64, &order_id, &SvtStage::EVT, &factory, &oracle);
        client.mint(&1u64, &order_id, &SvtStage::EVT, &factory, &oracle); // duplicate
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #3)")]
    fn view_nonexistent_svt_fails() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let minter = Address::generate(&env);

        let contract_id = env.register(FairfoundrySvt, ());
        let client = FairfoundrySvtClient::new(&env, &contract_id);

        client.init(&admin, &minter);
        client.view_svt(&999u64); // does not exist
    }
}
