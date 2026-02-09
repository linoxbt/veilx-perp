import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ArrowLeft, FileCode, Shield, Layers, Rocket, Lock, Server, BookOpen } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "contracts", label: "Smart Contracts", icon: FileCode },
  { id: "deployment", label: "Deployment Guide", icon: Rocket },
  { id: "security", label: "Security", icon: Shield },
] as const;

type TabId = typeof TABS[number]["id"];

const DocsPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to VeilX
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Eye className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">VeilX</span> <span className="text-foreground">Documentation</span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Complete technical documentation for VeilX — a private perpetual futures protocol built on Solana with Arcium MPC encryption.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <nav className="lg:w-56 shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "architecture" && <ArchitectureTab />}
            {activeTab === "contracts" && <ContractsTab />}
            {activeTab === "deployment" && <DeploymentTab />}
            {activeTab === "security" && <SecurityTab />}
          </main>
        </div>
      </div>
    </div>
  );
};

const DocSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
    <div className="prose prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

const CodeBlock = ({ title, language, code }: { title: string; language: string; code: string }) => (
  <div className="rounded-xl border border-border bg-muted overflow-hidden mb-4">
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
      <span className="text-xs font-mono text-muted-foreground">{title}</span>
      <span className="text-[10px] font-mono text-primary">{language}</span>
    </div>
    <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">{code}</pre>
  </div>
);

/* ========== TAB CONTENT ========== */

const OverviewTab = () => (
  <>
    <DocSection title="What is VeilX?">
      <p>
        VeilX is a private perpetual futures protocol built on <strong className="text-foreground">Solana</strong> that uses <strong className="text-foreground">Arcium's Multi-Party Computation (MPC)</strong> to keep trader intent, positions, and orders fully encrypted. Only final PnL is revealed to the public ledger.
      </p>
      <p>
        Traditional perp DEXs expose every detail of a trader's activity — entry prices, position sizes, liquidation thresholds, and stop-loss levels are all visible on-chain. This creates attack vectors: MEV bots front-run orders, sophisticated actors copy profitable traders, and liquidation hunters target exposed positions.
      </p>
      <p>VeilX solves this by encrypting all sensitive trading data via Arcium before it reaches the matching engine.</p>
    </DocSection>

    <DocSection title="Key Features">
      <ul className="space-y-2">
        <li className="flex items-start gap-2"><Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong className="text-foreground">Encrypted Orders:</strong> All order parameters (size, direction, leverage, limit price) are encrypted client-side before submission.</span></li>
        <li className="flex items-start gap-2"><Server className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong className="text-foreground">Private Matching:</strong> Arcium MPC nodes match orders on encrypted data — no single node sees plaintext.</span></li>
        <li className="flex items-start gap-2"><Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong className="text-foreground">Hidden Liquidations:</strong> Liquidation checks run privately, preventing targeted liquidation attacks.</span></li>
        <li className="flex items-start gap-2"><Eye className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong className="text-foreground">Selective Disclosure:</strong> Traders choose what to reveal — share PnL for compliance while keeping strategy private.</span></li>
      </ul>
    </DocSection>

    <DocSection title="Technology Stack">
      <ul className="space-y-1">
        <li>• <strong className="text-foreground">Blockchain:</strong> Solana (SVM)</li>
        <li>• <strong className="text-foreground">Privacy Layer:</strong> Arcium MPC Network</li>
        <li>• <strong className="text-foreground">Smart Contracts:</strong> Anchor Framework (Rust)</li>
        <li>• <strong className="text-foreground">Oracle:</strong> Pyth Network price feeds</li>
        <li>• <strong className="text-foreground">Frontend:</strong> React + TypeScript + Vite</li>
      </ul>
    </DocSection>
  </>
);

const ArchitectureTab = () => (
  <>
    <DocSection title="System Architecture">
      <p>VeilX uses a layered architecture that separates concerns between the client, Arcium MPC network, and Solana on-chain programs.</p>
    </DocSection>

    <div className="rounded-xl border border-border bg-card p-6 mb-8 font-mono text-xs">
      <p className="text-primary mb-4 text-sm font-semibold font-sans">Data Flow Diagram</p>
      <pre className="text-muted-foreground whitespace-pre overflow-x-auto">{`
┌─────────────┐     Encrypted      ┌──────────────────┐     Private       ┌────────────────┐
│   Client    │ ──────────────────▶ │  Arcium MPC      │ ────────────────▶ │   Solana       │
│   Browser   │     Order Data     │  Nodes (3-of-5)  │   Matched Trade  │   Program      │
└─────────────┘                    └──────────────────┘                   └────────────────┘
      │                                    │                                     │
      │  1. Encrypt order                  │  2. Match orders                    │  3. Settle
      │     parameters                     │     on ciphertext                   │     on-chain
      │     client-side                    │  3. Check collateral               │  4. Store
      │                                    │  4. Evaluate liquidations          │     encrypted
      │                                    │     (all on encrypted data)        │     positions
      │                                    │                                     │
      ▼                                    ▼                                     ▼
 Only user sees                    No single node                         Only final PnL
 their own data                    sees plaintext                         is public
`}</pre>
    </div>

    <DocSection title="Arcium MPC Integration">
      <p>Arcium's MPC protocol distributes computation across multiple independent nodes. Each node holds a secret share of the encrypted data, and computations are performed collaboratively without any single node learning the plaintext.</p>
      <p><strong className="text-foreground">Key Properties:</strong></p>
      <ul className="space-y-1">
        <li>• <strong className="text-foreground">3-of-5 Threshold:</strong> At least 3 nodes must collude to reconstruct plaintext (infeasible in practice).</li>
        <li>• <strong className="text-foreground">Verifiable Computation:</strong> Results include proofs that computation was performed correctly.</li>
        <li>• <strong className="text-foreground">Low Latency:</strong> Optimized for sub-second execution compatible with Solana's block time.</li>
      </ul>
    </DocSection>

    <DocSection title="On-Chain Components">
      <p>The Solana program stores encrypted position data and processes settlement instructions from the MPC network. It verifies MPC proofs before accepting state transitions.</p>
    </DocSection>
  </>
);

const ContractsTab = () => (
  <>
    <DocSection title="Smart Contracts Overview">
      <p>VeilX requires three main Solana programs built with the Anchor framework. Each contract handles a specific domain of the protocol.</p>
    </DocSection>

    <h3 className="text-lg font-semibold text-foreground mb-3">1. VeilX Core Program</h3>
    <p className="text-sm text-muted-foreground mb-4">
      The main program that manages markets, collateral deposits, and settlement. Integrates with Arcium for encrypted order processing.
    </p>
    <CodeBlock
      title="programs/veilx-core/src/lib.rs"
      language="Rust (Anchor)"
      code={`use anchor_lang::prelude::*;
use arcium_sdk::prelude::*;

declare_id!("VeiLXCoreXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

#[program]
pub mod veilx_core {
    use super::*;

    /// Initialize a new perpetual market
    pub fn initialize_market(
        ctx: Context<InitializeMarket>,
        market_params: MarketParams,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.authority = ctx.accounts.authority.key();
        market.oracle = market_params.oracle;
        market.base_symbol = market_params.base_symbol;
        market.max_leverage = market_params.max_leverage;
        market.maintenance_margin = market_params.maintenance_margin;
        market.taker_fee = market_params.taker_fee;
        market.maker_fee = market_params.maker_fee;
        market.insurance_fund = 0;
        market.open_interest = 0;
        market.bump = ctx.bumps.market;
        Ok(())
    }

    /// Deposit collateral (USDC) into the protocol
    pub fn deposit_collateral(
        ctx: Context<DepositCollateral>,
        amount: u64,
    ) -> Result<()> {
        // Transfer USDC from user to vault
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: ctx.accounts.user_token.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        anchor_spl::token::transfer(cpi_ctx, amount)?;

        let user_account = &mut ctx.accounts.user_account;
        user_account.collateral += amount;
        Ok(())
    }

    /// Submit an encrypted order via Arcium MPC
    pub fn submit_encrypted_order(
        ctx: Context<SubmitOrder>,
        encrypted_order: EncryptedOrder,
    ) -> Result<()> {
        // Validate the MPC proof
        require!(
            arcium_sdk::verify_mpc_proof(
                &encrypted_order.proof,
                &ctx.accounts.arcium_config.key(),
            ),
            VeilXError::InvalidMpcProof
        );

        let order = &mut ctx.accounts.order;
        order.user = ctx.accounts.user.key();
        order.market = ctx.accounts.market.key();
        order.encrypted_data = encrypted_order.ciphertext;
        order.mpc_proof = encrypted_order.proof;
        order.timestamp = Clock::get()?.unix_timestamp;
        order.status = OrderStatus::Pending;
        Ok(())
    }

    /// Settle a matched trade (called by MPC network)
    pub fn settle_trade(
        ctx: Context<SettleTrade>,
        settlement: TradeSettlement,
    ) -> Result<()> {
        require!(
            ctx.accounts.mpc_authority.key() == ctx.accounts.market.mpc_authority,
            VeilXError::UnauthorizedMpc
        );

        // Update encrypted positions for both parties
        let long_position = &mut ctx.accounts.long_position;
        long_position.encrypted_entry = settlement.encrypted_long_entry;
        long_position.encrypted_size = settlement.encrypted_long_size;

        let short_position = &mut ctx.accounts.short_position;
        short_position.encrypted_entry = settlement.encrypted_short_entry;
        short_position.encrypted_size = settlement.encrypted_short_size;

        // Only PnL is revealed on close
        Ok(())
    }

    /// Close position and reveal only PnL
    pub fn close_position(
        ctx: Context<ClosePosition>,
        revealed_pnl: i64,
        pnl_proof: Vec<u8>,
    ) -> Result<()> {
        // Verify the PnL proof from MPC
        require!(
            arcium_sdk::verify_pnl_proof(
                &pnl_proof,
                revealed_pnl,
                &ctx.accounts.position.encrypted_entry,
                &ctx.accounts.position.encrypted_size,
            ),
            VeilXError::InvalidPnlProof
        );

        let user_account = &mut ctx.accounts.user_account;
        if revealed_pnl > 0 {
            user_account.collateral += revealed_pnl as u64;
        } else {
            user_account.collateral = user_account.collateral
                .checked_sub((-revealed_pnl) as u64)
                .ok_or(VeilXError::InsufficientCollateral)?;
        }

        // Close the position account
        ctx.accounts.position.close(ctx.accounts.user.to_account_info())?;
        Ok(())
    }
}

/* ── Account structs ──────────────────────────── */

#[account]
pub struct Market {
    pub authority: Pubkey,
    pub oracle: Pubkey,
    pub mpc_authority: Pubkey,
    pub base_symbol: [u8; 8],
    pub max_leverage: u16,
    pub maintenance_margin: u16,  // basis points
    pub taker_fee: u16,           // basis points
    pub maker_fee: u16,           // basis points
    pub insurance_fund: u64,
    pub open_interest: u64,
    pub bump: u8,
}

#[account]
pub struct UserAccount {
    pub user: Pubkey,
    pub collateral: u64,
    pub bump: u8,
}

#[account]
pub struct Order {
    pub user: Pubkey,
    pub market: Pubkey,
    pub encrypted_data: Vec<u8>,
    pub mpc_proof: Vec<u8>,
    pub timestamp: i64,
    pub status: OrderStatus,
}

#[account]
pub struct Position {
    pub user: Pubkey,
    pub market: Pubkey,
    pub encrypted_entry: Vec<u8>,
    pub encrypted_size: Vec<u8>,
    pub encrypted_leverage: Vec<u8>,
    pub side: Side,
    pub timestamp: i64,
}

/* ── Enums & params ───────────────────────────── */

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum OrderStatus { Pending, Filled, Cancelled }

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum Side { Long, Short }

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MarketParams {
    pub oracle: Pubkey,
    pub base_symbol: [u8; 8],
    pub max_leverage: u16,
    pub maintenance_margin: u16,
    pub taker_fee: u16,
    pub maker_fee: u16,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct EncryptedOrder {
    pub ciphertext: Vec<u8>,
    pub proof: Vec<u8>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct TradeSettlement {
    pub encrypted_long_entry: Vec<u8>,
    pub encrypted_long_size: Vec<u8>,
    pub encrypted_short_entry: Vec<u8>,
    pub encrypted_short_size: Vec<u8>,
}

/* ── Errors ───────────────────────────────────── */

#[error_code]
pub enum VeilXError {
    #[msg("Invalid MPC proof")]
    InvalidMpcProof,
    #[msg("Unauthorized MPC authority")]
    UnauthorizedMpc,
    #[msg("Invalid PnL proof")]
    InvalidPnlProof,
    #[msg("Insufficient collateral")]
    InsufficientCollateral,
}`}
    />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">2. Arcium MPC Bridge Program</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Handles communication between the Solana on-chain program and the Arcium MPC network. Manages MPC node registration and proof verification.
    </p>
    <CodeBlock
      title="programs/veilx-mpc-bridge/src/lib.rs"
      language="Rust (Anchor)"
      code={`use anchor_lang::prelude::*;
use arcium_sdk::prelude::*;

declare_id!("VeiLXMpcBridgeXXXXXXXXXXXXXXXXXXXXXXXXXXX");

#[program]
pub mod veilx_mpc_bridge {
    use super::*;

    /// Initialize the MPC bridge configuration
    pub fn initialize(
        ctx: Context<Initialize>,
        threshold: u8,
        node_count: u8,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.threshold = threshold;       // e.g., 3
        config.node_count = node_count;     // e.g., 5
        config.active_nodes = 0;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    /// Register an MPC node
    pub fn register_node(
        ctx: Context<RegisterNode>,
        node_pubkey: Pubkey,
        encryption_key: [u8; 32],
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require!(
            config.active_nodes < config.node_count,
            BridgeError::MaxNodesReached
        );

        let node = &mut ctx.accounts.node;
        node.pubkey = node_pubkey;
        node.encryption_key = encryption_key;
        node.is_active = true;
        node.registered_at = Clock::get()?.unix_timestamp;

        config.active_nodes += 1;
        Ok(())
    }

    /// Submit encrypted order to MPC network
    pub fn submit_to_mpc(
        ctx: Context<SubmitToMpc>,
        encrypted_shares: Vec<Vec<u8>>,
    ) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(
            encrypted_shares.len() == config.node_count as usize,
            BridgeError::InvalidShareCount
        );

        let task = &mut ctx.accounts.mpc_task;
        task.submitter = ctx.accounts.user.key();
        task.encrypted_shares = encrypted_shares;
        task.status = TaskStatus::Submitted;
        task.created_at = Clock::get()?.unix_timestamp;
        task.responses = 0;

        emit!(MpcTaskCreated {
            task_id: task.key(),
            submitter: task.submitter,
        });

        Ok(())
    }

    /// MPC node submits computation result
    pub fn submit_result(
        ctx: Context<SubmitResult>,
        result_share: Vec<u8>,
        proof: Vec<u8>,
    ) -> Result<()> {
        let task = &mut ctx.accounts.mpc_task;
        let config = &ctx.accounts.config;

        task.responses += 1;

        if task.responses >= config.threshold {
            task.status = TaskStatus::Completed;
            emit!(MpcTaskCompleted {
                task_id: task.key(),
                responses: task.responses,
            });
        }

        Ok(())
    }
}

#[account]
pub struct MpcConfig {
    pub authority: Pubkey,
    pub threshold: u8,
    pub node_count: u8,
    pub active_nodes: u8,
    pub bump: u8,
}

#[account]
pub struct MpcNode {
    pub pubkey: Pubkey,
    pub encryption_key: [u8; 32],
    pub is_active: bool,
    pub registered_at: i64,
}

#[account]
pub struct MpcTask {
    pub submitter: Pubkey,
    pub encrypted_shares: Vec<Vec<u8>>,
    pub status: TaskStatus,
    pub created_at: i64,
    pub responses: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TaskStatus { Submitted, Processing, Completed, Failed }

#[event]
pub struct MpcTaskCreated {
    pub task_id: Pubkey,
    pub submitter: Pubkey,
}

#[event]
pub struct MpcTaskCompleted {
    pub task_id: Pubkey,
    pub responses: u8,
}

#[error_code]
pub enum BridgeError {
    #[msg("Maximum number of nodes reached")]
    MaxNodesReached,
    #[msg("Invalid number of encrypted shares")]
    InvalidShareCount,
}`}
    />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">3. Liquidation Engine Program</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Handles private liquidation checks. Collateral ratios are evaluated inside the MPC network — liquidation prices are never exposed on-chain.
    </p>
    <CodeBlock
      title="programs/veilx-liquidation/src/lib.rs"
      language="Rust (Anchor)"
      code={`use anchor_lang::prelude::*;

declare_id!("VeiLXLiquidationXXXXXXXXXXXXXXXXXXXXXXXXX");

#[program]
pub mod veilx_liquidation {
    use super::*;

    /// Initialize liquidation engine config
    pub fn initialize(
        ctx: Context<InitLiquidation>,
        liquidation_fee: u16,       // basis points
        insurance_share: u16,       // % of fee to insurance fund
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.liquidation_fee = liquidation_fee;
        config.insurance_share = insurance_share;
        config.total_liquidations = 0;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    /// Submit private liquidation check (called by MPC nodes)
    /// The MPC network evaluates: current_price vs encrypted_liquidation_price
    /// Only the boolean result (liquidatable or not) is revealed
    pub fn execute_liquidation(
        ctx: Context<ExecuteLiquidation>,
        mpc_proof: Vec<u8>,
        revealed_deficit: u64,    // only revealed after MPC confirms liquidation
    ) -> Result<()> {
        // Verify MPC proof that position is indeed undercollateralized
        require!(
            verify_liquidation_proof(&mpc_proof),
            LiquidationError::InvalidProof
        );

        let position = &mut ctx.accounts.position;
        let user_account = &mut ctx.accounts.user_account;
        let config = &ctx.accounts.config;

        // Calculate liquidation fee
        let fee = (revealed_deficit as u128)
            .checked_mul(config.liquidation_fee as u128)
            .unwrap()
            .checked_div(10000)
            .unwrap() as u64;

        // Insurance fund share
        let insurance_amount = fee
            .checked_mul(config.insurance_share as u64)
            .unwrap()
            .checked_div(100)
            .unwrap();

        // Liquidator reward
        let liquidator_reward = fee - insurance_amount;

        // Update state
        user_account.collateral = user_account.collateral
            .saturating_sub(revealed_deficit + fee);

        let config_mut = &mut ctx.accounts.config;
        config_mut.total_liquidations += 1;

        // Close position
        position.close(ctx.accounts.liquidator.to_account_info())?;

        emit!(LiquidationEvent {
            position: ctx.accounts.position.key(),
            deficit: revealed_deficit,
            fee,
            liquidator_reward,
        });

        Ok(())
    }
}

fn verify_liquidation_proof(proof: &[u8]) -> bool {
    // In production: verify Arcium MPC proof
    // that confirms position is undercollateralized
    // without revealing the actual liquidation price
    proof.len() > 0
}

#[account]
pub struct LiquidationConfig {
    pub authority: Pubkey,
    pub liquidation_fee: u16,
    pub insurance_share: u16,
    pub total_liquidations: u64,
    pub bump: u8,
}

#[event]
pub struct LiquidationEvent {
    pub position: Pubkey,
    pub deficit: u64,
    pub fee: u64,
    pub liquidator_reward: u64,
}

#[error_code]
pub enum LiquidationError {
    #[msg("Invalid liquidation proof from MPC")]
    InvalidProof,
}`}
    />
  </>
);

const DeploymentTab = () => (
  <>
    <DocSection title="Deployment Guide">
      <p>Follow these steps to deploy VeilX to Solana devnet/mainnet. Prerequisites: Rust, Solana CLI, Anchor CLI, and Node.js.</p>
    </DocSection>

    <h3 className="text-lg font-semibold text-foreground mb-3">Step 1: Environment Setup</h3>
    <CodeBlock title="Terminal" language="bash" code={`# Install Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest && avm use latest

# Create keypair (if needed)
solana-keygen new

# Set to devnet
solana config set --url devnet

# Airdrop SOL for deployment
solana airdrop 5`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 2: Clone & Build</h3>
    <CodeBlock title="Terminal" language="bash" code={`# Clone the VeilX repository
git clone https://github.com/your-org/veilx-protocol.git
cd veilx-protocol

# Install dependencies
yarn install

# Build all programs
anchor build

# Get program IDs (update declare_id! in each lib.rs)
solana address -k target/deploy/veilx_core-keypair.json
solana address -k target/deploy/veilx_mpc_bridge-keypair.json
solana address -k target/deploy/veilx_liquidation-keypair.json`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 3: Configure Arcium MPC</h3>
    <CodeBlock title="Terminal" language="bash" code={`# Install Arcium CLI
npm install -g @arcium/cli

# Initialize Arcium config for your project
arcium init --network devnet

# Register MPC nodes (minimum 3 for threshold security)
arcium node register --pubkey <NODE_1_PUBKEY> --encryption-key <KEY_1>
arcium node register --pubkey <NODE_2_PUBKEY> --encryption-key <KEY_2>
arcium node register --pubkey <NODE_3_PUBKEY> --encryption-key <KEY_3>

# Set threshold (3-of-5)
arcium config set-threshold 3`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 4: Deploy Programs</h3>
    <CodeBlock title="Terminal" language="bash" code={`# Deploy to devnet
anchor deploy --provider.cluster devnet

# Initialize the core market (SOL-PERP)
anchor run initialize-market -- \\
  --oracle <PYTH_SOL_USD_FEED> \\
  --symbol SOL \\
  --max-leverage 50 \\
  --maintenance-margin 500 \\
  --taker-fee 10 \\
  --maker-fee 5

# Initialize MPC bridge
anchor run initialize-bridge -- \\
  --threshold 3 \\
  --node-count 5

# Initialize liquidation engine
anchor run initialize-liquidation -- \\
  --fee 50 \\
  --insurance-share 50`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 5: Integrate Pyth Oracle</h3>
    <CodeBlock title="scripts/setup-oracle.ts" language="TypeScript" code={`import { Connection, PublicKey } from "@solana/web3.js";
import { PythHttpClient, getPythProgramKeyForCluster } from "@pythnetwork/client";

const PYTH_FEEDS = {
  "SOL/USD": new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
  "ETH/USD": new PublicKey("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB"),
  "BTC/USD": new PublicKey("GVXRSBjFk6e6J3NbVPXohDJwFP7skkZNhMhSsMFoMJFi"),
};

async function setupOracles() {
  const connection = new Connection("https://api.devnet.solana.com");
  const pythClient = new PythHttpClient(
    connection,
    getPythProgramKeyForCluster("devnet")
  );
  
  const data = await pythClient.getData();
  
  for (const [pair, feed] of Object.entries(PYTH_FEEDS)) {
    const price = data.productPrice.get(pair);
    console.log(\`\${pair}: $\${price?.price ?? "N/A"}\`);
  }
}

setupOracles();`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 6: Verify Deployment</h3>
    <CodeBlock title="Terminal" language="bash" code={`# Run test suite
anchor test

# Verify programs on Solana Explorer
solana program show <VEILX_CORE_PROGRAM_ID>
solana program show <VEILX_MPC_BRIDGE_PROGRAM_ID>
solana program show <VEILX_LIQUIDATION_PROGRAM_ID>

# Test encrypted order submission
anchor run test-encrypted-order`} />
  </>
);

const SecurityTab = () => (
  <>
    <DocSection title="Security Architecture">
      <p>VeilX implements multiple layers of security to protect trader data and protocol integrity.</p>
    </DocSection>

    <DocSection title="Privacy Guarantees">
      <ul className="space-y-2">
        <li className="flex items-start gap-2"><Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong className="text-foreground">Order Privacy:</strong> All order parameters (size, direction, leverage, limit price) are secret-shared across MPC nodes. No single node can reconstruct the plaintext.</span></li>
        <li className="flex items-start gap-2"><Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong className="text-foreground">Position Privacy:</strong> Open positions are stored as encrypted ciphertexts on-chain. Only the position owner can decrypt via their private key.</span></li>
        <li className="flex items-start gap-2"><Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong className="text-foreground">Liquidation Privacy:</strong> Liquidation checks run inside the MPC network. Only a boolean result (liquidatable or not) is revealed, never the actual threshold.</span></li>
      </ul>
    </DocSection>

    <DocSection title="Attack Vectors Mitigated">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-3 font-medium text-foreground">Attack</th>
              <th className="text-left p-3 font-medium text-foreground">Traditional DEX</th>
              <th className="text-left p-3 font-medium text-foreground">VeilX</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="p-3">Front-running</td>
              <td className="p-3 text-loss">Vulnerable — orders visible in mempool</td>
              <td className="p-3 text-profit">Protected — orders encrypted before submission</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="p-3">Copy-trading</td>
              <td className="p-3 text-loss">Exposed — positions visible on-chain</td>
              <td className="p-3 text-profit">Private — positions are encrypted ciphertexts</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="p-3">Targeted liquidation</td>
              <td className="p-3 text-loss">Easy — liquidation prices calculable</td>
              <td className="p-3 text-profit">Impossible — thresholds hidden in MPC</td>
            </tr>
            <tr>
              <td className="p-3">MEV extraction</td>
              <td className="p-3 text-loss">Common — validators reorder transactions</td>
              <td className="p-3 text-profit">Mitigated — encrypted orders prevent value extraction</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DocSection>

    <DocSection title="Audit & Best Practices">
      <ul className="space-y-1">
        <li>• All smart contracts should undergo third-party security audits before mainnet deployment.</li>
        <li>• MPC node operators are independently vetted and geographically distributed.</li>
        <li>• Protocol upgrades require multi-sig governance approval.</li>
        <li>• Insurance fund protects against undercollateralized liquidations.</li>
        <li>• Client-side encryption uses audited cryptographic libraries.</li>
      </ul>
    </DocSection>
  </>
);

export default DocsPage;
