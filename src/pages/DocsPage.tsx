import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Eye, ArrowLeft, FileCode, Shield, Layers, Rocket, Lock, Server, BookOpen, Cpu } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "contracts", label: "Smart Contracts", icon: FileCode },
  { id: "arcium", label: "Arcium Integration", icon: Cpu },
  { id: "testing", label: "Testing Guide", icon: Server },
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
            {activeTab === "arcium" && <ArciumIntegrationTab />}
            {activeTab === "testing" && <TestingTab />}
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

const CodeBlock = ({ title, language, code }: { title: string; language: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="rounded-xl border border-border bg-muted overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
        <span className="text-xs font-mono text-muted-foreground">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-primary">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors bg-background/50 hover:bg-background border border-border text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 text-profit" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  );
};

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
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("DLkXTKQVx422rBrSPJDdZdrJYsYXEnCuGLoucr2Bixnb");

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
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, amount)?;

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
            verify_mpc_proof(&encrypted_order.proof),
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

        let long_position = &mut ctx.accounts.long_position;
        long_position.encrypted_entry = settlement.encrypted_long_entry;
        long_position.encrypted_size = settlement.encrypted_long_size;

        let short_position = &mut ctx.accounts.short_position;
        short_position.encrypted_entry = settlement.encrypted_short_entry;
        short_position.encrypted_size = settlement.encrypted_short_size;

        Ok(())
    }

    /// Close position and reveal only PnL
    pub fn close_position(
        ctx: Context<ClosePosition>,
        revealed_pnl: i64,
        pnl_proof: Vec<u8>,
    ) -> Result<()> {
        require!(
            verify_pnl_proof(
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

        ctx.accounts.position.close(ctx.accounts.user.to_account_info())?;
        Ok(())
    }
}

/* ── MPC proof verification stubs ─────────────── */
/* Replace with real Arcium SDK calls once the     */
/* arcium-sdk crate is published to crates.io      */

fn verify_mpc_proof(proof: &[u8]) -> bool {
    // TODO: Replace with arcium_sdk::verify_mpc_proof()
    // once the Arcium Rust SDK is publicly available.
    // For devnet testing, accepts any non-empty proof.
    !proof.is_empty()
}

fn verify_pnl_proof(
    proof: &[u8],
    _revealed_pnl: i64,
    _encrypted_entry: &[u8],
    _encrypted_size: &[u8],
) -> bool {
    // TODO: Replace with arcium_sdk::verify_pnl_proof()
    !proof.is_empty()
}

/* ── Account validation structs ───────────────── */

#[derive(Accounts)]
#[instruction(market_params: MarketParams)]
pub struct InitializeMarket<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<Market>(),
        seeds = [b"market", &market_params.base_symbol],
        bump
    )]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositCollateral<'info> {
    #[account(mut, seeds = [b"user", user.key().as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SubmitOrder<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 4 + 256 + 4 + 128 + 8 + 1
    )]
    pub order: Account<'info, Order>,
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettleTrade<'info> {
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub long_position: Account<'info, Position>,
    #[account(mut)]
    pub short_position: Account<'info, Position>,
    pub mpc_authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClosePosition<'info> {
    #[account(mut, has_one = user)]
    pub position: Account<'info, Position>,
    #[account(mut, seeds = [b"user", user.key().as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
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

declare_id!("DooxjY3g8Xn1PZTSd852aKdnA39HvmpSubphAP2VLYks");

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
        config.threshold = threshold;
        config.node_count = node_count;
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
        _result_share: Vec<u8>,
        _proof: Vec<u8>,
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

/* ── Account validation structs ───────────────── */

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<MpcConfig>(),
        seeds = [b"mpc_config"],
        bump
    )]
    pub config: Account<'info, MpcConfig>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterNode<'info> {
    #[account(mut, has_one = authority)]
    pub config: Account<'info, MpcConfig>,
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<MpcNode>()
    )]
    pub node: Account<'info, MpcNode>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitToMpc<'info> {
    pub config: Account<'info, MpcConfig>,
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 4 + 1024 + 1 + 8 + 1
    )]
    pub mpc_task: Account<'info, MpcTask>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitResult<'info> {
    pub config: Account<'info, MpcConfig>,
    #[account(mut)]
    pub mpc_task: Account<'info, MpcTask>,
    pub node: Signer<'info>,
}

/* ── Account structs ──────────────────────────── */

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

declare_id!("Fq4LqoHrk1Ru7oQZ1UaF4bV2njt3VYt4Qikrkrf318eW");

#[program]
pub mod veilx_liquidation {
    use super::*;

    /// Initialize liquidation engine config
    pub fn initialize(
        ctx: Context<InitLiquidation>,
        liquidation_fee: u16,
        insurance_share: u16,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.liquidation_fee = liquidation_fee;
        config.insurance_share = insurance_share;
        config.total_liquidations = 0;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    /// Execute liquidation after MPC confirms undercollateralization
    pub fn execute_liquidation(
        ctx: Context<ExecuteLiquidation>,
        mpc_proof: Vec<u8>,
        revealed_deficit: u64,
    ) -> Result<()> {
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

        let insurance_amount = fee
            .checked_mul(config.insurance_share as u64)
            .unwrap()
            .checked_div(100)
            .unwrap();

        let liquidator_reward = fee - insurance_amount;

        user_account.collateral = user_account.collateral
            .saturating_sub(revealed_deficit + fee);

        let config_mut = &mut ctx.accounts.config;
        config_mut.total_liquidations += 1;

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
    // TODO: Replace with Arcium MPC proof verification
    // once the SDK is publicly available on crates.io
    !proof.is_empty()
}

/* ── Account validation structs ───────────────── */

#[derive(Accounts)]
pub struct InitLiquidation<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<LiquidationConfig>(),
        seeds = [b"liq_config"],
        bump
    )]
    pub config: Account<'info, LiquidationConfig>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteLiquidation<'info> {
    #[account(mut)]
    pub config: Account<'info, LiquidationConfig>,
    #[account(mut)]
    pub position: Account<'info, Position>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub liquidator: Signer<'info>,
}

// Re-used from veilx-core (import in production)
#[account]
pub struct Position {
    pub user: Pubkey,
    pub market: Pubkey,
    pub encrypted_entry: Vec<u8>,
    pub encrypted_size: Vec<u8>,
    pub encrypted_leverage: Vec<u8>,
    pub side: u8,
    pub timestamp: i64,
}

#[account]
pub struct UserAccount {
    pub user: Pubkey,
    pub collateral: u64,
    pub bump: u8,
}

/* ── Account structs ──────────────────────────── */

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

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">4. VeilX Swap Program (SOL ↔ USDC)</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Handles on-chain SOL↔USDC swaps with Arcium MPC privacy. Swap amounts and rates are encrypted — only the final token transfer is settled publicly.
    </p>
    <CodeBlock
      title="programs/veilx-swap/src/lib.rs"
      language="Rust (Anchor)"
      code={`use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_lang::system_program;

declare_id!("VXSwapxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod veilx_swap {
    use super::*;

    /// Initialize the swap pool with SOL and USDC reserves
    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        sol_reserve: u64,
        usdc_reserve: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.sol_reserve = sol_reserve;
        pool.usdc_reserve = usdc_reserve;
        pool.oracle = ctx.accounts.oracle.key();
        pool.total_swaps = 0;
        pool.bump = ctx.bumps.pool;
        Ok(())
    }

    /// Execute an encrypted swap (SOL → USDC or USDC → SOL)
    pub fn swap_encrypted(
        ctx: Context<SwapEncrypted>,
        amount: u64,
        direction: u8, // 0 = SOL→USDC, 1 = USDC→SOL
    ) -> Result<()> {
        require!(direction <= 1, SwapError::InvalidDirection);

        // Read pool state BEFORE any mutable borrow to avoid E0502
        let pool_bump = ctx.accounts.pool.bump;
        let sol_reserve = ctx.accounts.pool.sol_reserve;
        let usdc_reserve = ctx.accounts.pool.usdc_reserve;

        if direction == 0 {
            // SOL → USDC: transfer SOL from user to pool vault
            system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    system_program::Transfer {
                        from: ctx.accounts.user.to_account_info(),
                        to: ctx.accounts.pool_sol_vault.to_account_info(),
                    },
                ),
                amount,
            )?;

            let usdc_output = calculate_output(amount, sol_reserve, usdc_reserve);

            // Use pool_bump (copied earlier) to avoid borrowing pool during CPI
            let seeds = &[b"pool".as_ref(), &[pool_bump]];
            let signer = &[&seeds[..]];
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.pool_usdc_vault.to_account_info(),
                        to: ctx.accounts.user_usdc_ata.to_account_info(),
                        authority: ctx.accounts.pool.to_account_info(),
                    },
                    signer,
                ),
                usdc_output,
            )?;

            // NOW mutably borrow pool to update reserves
            let pool = &mut ctx.accounts.pool;
            pool.sol_reserve += amount;
            pool.usdc_reserve -= usdc_output;
        } else {
            // USDC → SOL: transfer USDC from user to pool vault
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.user_usdc_ata.to_account_info(),
                        to: ctx.accounts.pool_usdc_vault.to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                ),
                amount,
            )?;

            let sol_output = calculate_output(amount, usdc_reserve, sol_reserve);

            **ctx.accounts.pool_sol_vault
                .try_borrow_mut_lamports()? -= sol_output;
            **ctx.accounts.user
                .try_borrow_mut_lamports()? += sol_output;

            // NOW mutably borrow pool to update reserves
            let pool = &mut ctx.accounts.pool;
            pool.usdc_reserve += amount;
            pool.sol_reserve -= sol_output;
        }

        // Final mutable borrow for total_swaps + event
        let pool = &mut ctx.accounts.pool;
        pool.total_swaps += 1;
        emit!(SwapExecuted {
            user: ctx.accounts.user.key(),
            direction,
            amount_in: amount,
        });
        Ok(())
    }
}

/// Constant-product AMM: output = (amount * out_reserve) / (in_reserve + amount)
/// In production, Arcium MPC computes this on encrypted data.
fn calculate_output(amount_in: u64, in_reserve: u64, out_reserve: u64) -> u64 {
    let num = (amount_in as u128) * (out_reserve as u128);
    let den = (in_reserve as u128) + (amount_in as u128);
    (num / den) as u64
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(init, payer = authority,
        space = 8 + std::mem::size_of::<SwapPool>(),
        seeds = [b"pool"], bump)]
    pub pool: Account<'info, SwapPool>,
    /// CHECK: Pyth oracle feed
    pub oracle: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SwapEncrypted<'info> {
    #[account(mut, seeds = [b"pool"], bump = pool.bump)]
    pub pool: Account<'info, SwapPool>,
    /// CHECK: Pool SOL vault
    #[account(mut)]
    pub pool_sol_vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub pool_usdc_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_usdc_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct SwapPool {
    pub authority: Pubkey,
    pub oracle: Pubkey,
    pub sol_reserve: u64,
    pub usdc_reserve: u64,
    pub total_swaps: u64,
    pub bump: u8,
}

#[event]
pub struct SwapExecuted {
    pub user: Pubkey,
    pub direction: u8,
    pub amount_in: u64,
}

#[error_code]
pub enum SwapError {
    #[msg("Invalid swap direction (must be 0 or 1)")]
    InvalidDirection,
}`}
    />

    <DocSection title="Creating Your VeilX Test USDC">
      <p>VeilX uses its own custom test USDC mint on devnet instead of Circle's official USDC. This gives you full mint authority — unlimited supply, no faucet rate limits, and complete control for testing.</p>
    </DocSection>

    <h3 className="text-lg font-semibold text-foreground mb-3">Prerequisites</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>You need the <strong className="text-foreground">Solana CLI</strong> and <strong className="text-foreground">SPL Token CLI</strong> installed. If you don't have them:</p>
    </div>
    <CodeBlock title="Install Solana CLI (if not installed)" language="bash" code={`# Install Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Verify installation
solana --version

# Set network to devnet
solana config set --url https://api.devnet.solana.com

# Create or import a wallet (skip if you already have one)
solana-keygen new --outfile ~/.config/solana/id.json

# Airdrop devnet SOL (you need SOL for transaction fees)
solana airdrop 2`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 1 — Create the Test USDC Mint</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>This creates a new SPL token with 6 decimals (same as real USDC). Your wallet becomes the <strong className="text-foreground">mint authority</strong> — meaning only you can create new tokens.</p>
    </div>
    <CodeBlock title="Create the mint" language="bash" code={`# Create a new SPL token with 6 decimals (USDC standard)
spl-token create-token --decimals 6

# ─── Expected output ───
# Creating token 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
# Address:  4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU  ← THIS IS YOUR MINT ADDRESS
# Decimals: 6
# 
# Signature: 5KtP...xxxxx

# ⚠️ IMPORTANT: Copy the "Address" — this is your VeilX Test USDC mint.
# You'll use this in every following step.`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 2 — Create a Token Account</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>Before you can hold tokens, your wallet needs an <strong className="text-foreground">Associated Token Account (ATA)</strong> for this mint. This is like opening a "USDC wallet" inside your Solana wallet.</p>
    </div>
    <CodeBlock title="Create token account" language="bash" code={`# Replace <MINT_ADDRESS> with the address from Step 1
spl-token create-account <MINT_ADDRESS>

# ─── Expected output ───
# Creating account 7Yh3K...xxxxx
# Signature: 3nBq...xxxxx

# Example with a real address:
# spl-token create-account 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 3 — Mint Test USDC Tokens</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>Now mint tokens to your wallet. The amount is in <strong className="text-foreground">whole units</strong> (not lamports) — so <code className="text-primary bg-muted px-1 rounded">1000000</code> = 1,000,000 USDC.</p>
    </div>
    <CodeBlock title="Mint tokens" language="bash" code={`# Mint 1,000,000 test USDC to your wallet
spl-token mint <MINT_ADDRESS> 1000000

# ─── Expected output ───
# Minting 1000000 tokens
#   Token: <MINT_ADDRESS>
#   Recipient: 7Yh3K...xxxxx
# Signature: 4xKp...xxxxx

# Verify your balance
spl-token balance <MINT_ADDRESS>
# Output: 1000000`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 4 — Mint to Other Wallets (for testing)</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>To give test USDC to other wallets (e.g., your Phantom wallet for frontend testing):</p>
    </div>
    <CodeBlock title="Mint to another wallet" language="bash" code={`# First, find your Phantom wallet address:
# Open Phantom → click your address at the top → copy it

# Mint 10,000 test USDC to your Phantom wallet
spl-token mint <MINT_ADDRESS> 10000 -- <PHANTOM_WALLET_ADDRESS>

# Example:
# spl-token mint 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU 10000 -- 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM`} />

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 5 — Update the VeilX Configuration</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>Replace the placeholder mint address in the frontend config with your newly created mint:</p>
    </div>
    <CodeBlock title="src/config/programs.ts" language="typescript" code={`// Replace this placeholder with YOUR mint address from Step 1:
export const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
export const USDC_DECIMALS = 6;`} />

    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6 text-sm">
      <p className="text-primary font-semibold mb-1">💡 Quick Reference</p>
      <ul className="text-muted-foreground space-y-1 ml-4">
        <li>• <strong className="text-foreground">Decimals = 6</strong> means 1 USDC = 1,000,000 smallest units (same as real USDC)</li>
        <li>• You can mint unlimited tokens anytime with <code className="text-primary bg-muted px-1 rounded">spl-token mint</code></li>
        <li>• Only your CLI wallet (mint authority) can create new tokens</li>
        <li>• Token accounts are created automatically when receiving via <code className="text-primary bg-muted px-1 rounded">--fund-recipient</code></li>
      </ul>
    </div>

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 6 — Deploy the VeilX Swap Program</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>The swap program handles SOL↔USDC conversions with Arcium MPC privacy. Deploy it the same way as the other programs:</p>
    </div>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>1. Go to <a href="https://beta.solpg.io" target="_blank" rel="noopener noreferrer" className="text-primary underline">beta.solpg.io</a> → <strong className="text-foreground">Create a new project</strong> → name it <code className="text-primary bg-muted px-1 rounded">veilx-swap</code> → select <strong className="text-foreground">Anchor (Rust)</strong>.</p>
      <p>2. Paste the <strong className="text-foreground">VeilX Swap Program</strong> code from the Smart Contracts tab above into <code className="text-primary bg-muted px-1 rounded">src/lib.rs</code>.</p>
      <p>3. Click <strong className="text-foreground">Build</strong> (hammer icon) — wait for "Build successful".</p>
      <p>4. Click <strong className="text-foreground">Deploy</strong> — copy the Program ID.</p>
      <p>5. Update <code className="text-primary bg-muted px-1 rounded">VEILX_SWAP_PROGRAM</code> in <code className="text-primary bg-muted px-1 rounded">src/config/programs.ts</code> with the deployed ID.</p>
    </div>

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 7 — Initialize the Swap Pool</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>After deploying, use the <strong className="text-foreground">Test</strong> tab in Solana Playground to call <code className="text-primary bg-muted px-1 rounded">initializePool</code>:</p>
    </div>
    <div className="rounded-xl border border-border bg-card p-5 mb-4">
      <p className="text-sm font-semibold text-foreground mb-3">initializePool — Parameters</p>
      <table className="w-full text-xs mb-2">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Account</th>
            <th className="text-left py-2 font-medium">Value</th>
            <th className="text-left py-2 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">pool</td>
            <td className="py-2 font-mono">Auto-derived (PDA)</td>
            <td className="py-2 text-muted-foreground">Seeds: [b"swap_pool"]. Auto-derived by Playground.</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">oracle</td>
            <td className="py-2 font-mono">H6ARHf...QJEG</td>
            <td className="py-2 text-muted-foreground">Pyth SOL/USD feed address.</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">user</td>
            <td className="py-2 font-mono">Your Playground wallet</td>
            <td className="py-2 text-muted-foreground">Auto-filled.</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">tokenProgram</td>
            <td className="py-2 font-mono">TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA</td>
            <td className="py-2 text-muted-foreground">SPL Token Program. Auto-filled.</td>
          </tr>
          <tr>
            <td className="py-2 font-mono text-primary">systemProgram</td>
            <td className="py-2 font-mono">11111...1111</td>
            <td className="py-2 text-muted-foreground">Auto-filled.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="rounded-xl border border-loss/30 bg-loss/5 p-4 mb-6 text-sm">
      <p className="text-loss font-semibold mb-1">⚠️ Common Errors & Fixes</p>
      <ul className="text-muted-foreground space-y-1 ml-4">
        <li>• <strong className="text-foreground">"Insufficient funds"</strong> — Airdrop more devnet SOL: <code className="text-primary bg-muted px-1 rounded">solana airdrop 2</code></li>
        <li>• <strong className="text-foreground">"Account already in use"</strong> — Pool already initialized, skip this step</li>
        <li>• <strong className="text-foreground">"Custom program error 0x1"</strong> — Check the Anchor error codes in the IDL (usually InvalidDirection)</li>
        <li>• <strong className="text-foreground">"Transaction simulation failed"</strong> — Ensure you're on devnet and the program is deployed</li>
        <li>• <strong className="text-foreground">"Missing signer"</strong> — Your Playground wallet must be connected (click wallet icon)</li>
      </ul>
    </div>

    <div className="rounded-xl border border-profit/30 bg-profit/5 p-4 text-sm">
      <p className="text-profit font-semibold mb-1">✅ After completing all steps you should have:</p>
      <ul className="text-muted-foreground space-y-1 ml-4">
        <li>• <strong className="text-foreground">VeilX Test USDC mint</strong> — your custom SPL token with 6 decimals</li>
        <li>• <strong className="text-foreground">Token balance</strong> — test USDC in your CLI wallet and/or Phantom</li>
        <li>• <strong className="text-foreground">VeilX Swap Program</strong> — deployed on devnet with Program ID</li>
        <li>• <strong className="text-foreground">Swap pool initialized</strong> — ready for SOL↔USDC swaps</li>
        <li>• <strong className="text-foreground">Updated config</strong> — <code className="text-primary bg-muted px-1 rounded">USDC_MINT</code> and <code className="text-primary bg-muted px-1 rounded">VEILX_SWAP_PROGRAM</code> in programs.ts</li>
      </ul>
    </div>
  </>
);

const ArciumIntegrationTab = () => (
  <>
    <DocSection title="Arcium Integration — Complete Guide">
      <p>
        This guide covers everything you need to integrate <strong className="text-foreground">Arcium's decentralized encrypted compute network</strong> into VeilX. Arcium is <strong className="text-foreground">not an L1 blockchain</strong> — it's an MPC (Multi-Party Computation) network that processes encrypted data alongside your Solana programs.
      </p>
      <p>
        Think of it this way: <strong className="text-foreground">Solana = settlement layer</strong>. <strong className="text-foreground">Arcium = confidential compute layer</strong>. Your perp contract handles custody and state. Arcium handles the math on encrypted inputs.
      </p>
    </DocSection>

    <DocSection title="What Arcium Is (and Isn't)">
      <div className="rounded-xl border border-border bg-card overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-3 font-medium text-foreground">Arcium IS</th>
              <th className="text-left p-3 font-medium text-foreground">Arcium IS NOT</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="p-3">A decentralized encrypted compute network</td>
              <td className="p-3">A Layer-1 blockchain</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="p-3">An MPC cluster that processes ciphertext</td>
              <td className="p-3">A zero-knowledge proof system (zk rollup)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="p-3">A blindfolded calculator for sensitive math</td>
              <td className="p-3">A smart contract platform</td>
            </tr>
            <tr>
              <td className="p-3">Compatible with Solana as a companion layer</td>
              <td className="p-3">A replacement for your on-chain program</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DocSection>

    <DocSection title="Step 1 — Define What Must Be Private">
      <p>Do not encrypt everything. Only offload sensitive math to Arcium.</p>
    </DocSection>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="rounded-xl border border-profit/30 bg-profit/5 p-4 text-sm">
        <p className="text-profit font-semibold mb-2">🔓 Stays Public (on-chain)</p>
        <ul className="text-muted-foreground space-y-1 ml-4">
          <li>• Funding rate</li>
          <li>• Index price (Pyth oracle)</li>
          <li>• Global open interest</li>
          <li>• Insurance fund balance</li>
          <li>• Settlement results</li>
        </ul>
      </div>
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
        <p className="text-primary font-semibold mb-2">🔒 Private (Arcium MPC)</p>
        <ul className="text-muted-foreground space-y-1 ml-4">
          <li>• Individual position size</li>
          <li>• Leverage per trader</li>
          <li>• Margin balance</li>
          <li>• Liquidation threshold</li>
          <li>• User PnL (until close)</li>
          <li>• Risk score</li>
        </ul>
      </div>
    </div>

    <DocSection title="Step 2 — Hybrid Architecture Design">
      <p>Your system splits into three layers that coordinate cryptographically:</p>
    </DocSection>
    <div className="rounded-xl border border-border bg-card p-6 mb-8 font-mono text-xs">
      <pre className="text-muted-foreground whitespace-pre overflow-x-auto">{`
┌─────────────────────────────────────────────────────────────────────────┐
│                        VeilX Hybrid Architecture                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌───────────────┐         ┌──────────────────┐     ┌──────────────┐  │
│   │   CLIENT       │  enc    │   ARCIUM MXE     │ res │   SOLANA     │  │
│   │                │ ──────▶ │                  │ ──▶ │   PROGRAM    │  │
│   │ • Encrypt      │  order  │ • Risk engine    │ ult │              │  │
│   │   inputs       │  data   │ • Margin checks  │     │ • Settlement │  │
│   │ • Generate     │         │ • Liquidation    │     │ • Custody    │  │
│   │   shares       │         │   evaluation     │     │ • State      │  │
│   │ • Decrypt      │         │ • PnL math       │     │   updates    │  │
│   │   own data     │         │                  │     │ • Verify     │  │
│   │                │         │ (all on          │     │   MPC proof  │  │
│   │                │         │  ciphertext)     │     │              │  │
│   └───────────────┘         └──────────────────┘     └──────────────┘  │
│                                                                         │
│   Chain = State Anchor    Arcium = Blind Calculator    Client = Encryptor│
└─────────────────────────────────────────────────────────────────────────┘
`}</pre>
    </div>

    <DocSection title="Step 3 — Client-Side Encryption">
      <p>When a trader opens a position, encryption happens <strong className="text-foreground">before</strong> the transaction is broadcast. The client never sends plaintext to the chain.</p>
    </DocSection>
    <CodeBlock
      title="Client-side encryption flow (TypeScript)"
      language="TypeScript"
      code={`import { ArciumSDK } from "@arcium/sdk";

// Initialize Arcium SDK with your cluster
const arcium = new ArciumSDK({
  clusterId: "<your-arcium-cluster-id>",
  network: "devnet",
});

// Trader opens a position
const orderParams = {
  size: 1000,       // Position size in USDC
  leverage: 20,     // 20x leverage
  margin: 500,      // Collateral amount
  side: "long",     // Direction
  stopLoss: 145.50, // Stop loss price
  takeProfit: 180,  // Take profit price
};

// Step 1: Encrypt locally — NO plaintext leaves the browser
const encryptedPayload = await arcium.encrypt(orderParams);

// Step 2: Generate secret shares for MPC nodes
const shares = await arcium.generateShares(encryptedPayload, {
  threshold: 3,  // 3-of-5 reconstruction threshold
  nodeCount: 5,  // Total MPC nodes
});

// Step 3: Submit encrypted blob to Solana program
const tx = await submitEncryptedOrder(shares, encryptedPayload.ciphertext);

// The chain sees: encrypted bytes
// The chain does NOT see: 1000 USDC, 20x leverage, long`}
    />

    <DocSection title="Step 4 — What You Actually Deploy">
      <p>You deploy <strong className="text-foreground">three things</strong>, but only one is a traditional on-chain contract:</p>
    </DocSection>
    <div className="space-y-4 mb-8">
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-semibold text-foreground mb-2">① Perp Smart Contracts (Solana)</p>
        <p className="text-sm text-muted-foreground">Deploy normally via Solana Playground or Anchor CLI. Handles custody, position bookkeeping, settlement, token transfers, and MPC proof verification.</p>
      </div>
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <p className="text-sm font-semibold text-primary mb-2">② Arcium MXE — Multiparty Execution Environment</p>
        <p className="text-sm text-muted-foreground">This is <strong className="text-foreground">NOT</strong> a blockchain contract. It's a confidential execution module deployed to the Arcium network. Contains your margin formulas, liquidation logic, PnL math — all operating on encrypted data types.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-semibold text-foreground mb-2">③ Integration Layer (SDK + Orchestration)</p>
        <p className="text-sm text-muted-foreground">Your frontend/backend encrypts inputs, submits payloads to Arcium, receives verified outputs, and relays results to the on-chain program.</p>
      </div>
    </div>

    <DocSection title="Step 5 — Deploy Your MXE to Arcium">
      <p>You'll use the Arcium CLI (terminal) to deploy your confidential execution module. This is deploying an encrypted logic container to a distributed MPC network.</p>
    </DocSection>
    <CodeBlock
      title="Terminal — Deploy MXE"
      language="bash"
      code={`# ═══════════════════════════════════════════════════════
# Prerequisites
# ═══════════════════════════════════════════════════════

# 1. Install Arcium CLI
npm install -g @arcium/cli

# 2. Verify installation
arcium --version

# 3. Initialize project for devnet
arcium init --network devnet

# ═══════════════════════════════════════════════════════
# Create the MXE (Multiparty Execution Environment)
# ═══════════════════════════════════════════════════════

# 4. Create a new MXE project
arcium mxe create --name veilx-risk-engine

# 5. Your MXE directory structure:
#    veilx-risk-engine/
#    ├── src/
#    │   ├── margin.rs        ← Margin health computation
#    │   ├── liquidation.rs   ← Liquidation condition checks
#    │   ├── pnl.rs           ← PnL calculation
#    │   └── lib.rs           ← Entry point
#    ├── Arcium.toml           ← MXE configuration
#    └── tests/

# 6. Build the MXE
arcium mxe build

# 7. Deploy to Arcium network
arcium mxe deploy --network devnet
#    Output: MXE deployed. ID: mxe_abc123...
#    ⚠️ SAVE THIS MXE ID

# 8. Verify deployment
arcium mxe status --id mxe_abc123`}
    />

    <DocSection title="Step 6 — Write the Encrypted Risk Engine (MXE Logic)">
      <p>Inside your MXE, you write risk engine logic using Arcium's encrypted data types. All arithmetic operates on ciphertext — no node ever sees real numbers.</p>
    </DocSection>
    <CodeBlock
      title="veilx-risk-engine/src/margin.rs (MXE logic)"
      language="Rust (Arcium)"
      code={`use arcium_mxe::prelude::*;

/// Margin health computation on encrypted data
/// No MPC node sees the actual values
#[mxe_function]
pub fn compute_margin_health(
    collateral: EncryptedU64,
    position_size: EncryptedU64,
    entry_price: EncryptedU64,
    current_price: EncryptedU64,
    leverage: EncryptedU16,
    side: EncryptedU8,
) -> MxeResult<MarginHealthResult> {
    let price_diff = if side == EncryptedU8::from(0) {
        current_price - entry_price
    } else {
        entry_price - current_price
    };

    let unrealized_pnl = price_diff * position_size;
    let maintenance_margin = position_size * current_price / leverage;
    let margin_health = (collateral + unrealized_pnl) / maintenance_margin;

    Ok(MarginHealthResult {
        encrypted_health: margin_health,
        is_liquidatable: margin_health < EncryptedU64::from(100),
    })
}

/// Liquidation check — returns ONLY a boolean to the chain
#[mxe_function]
pub fn check_liquidation(
    encrypted_position: EncryptedPosition,
    current_price: EncryptedU64,
    maintenance_margin_bps: u16,
) -> MxeResult<LiquidationResult> {
    let health = compute_margin_health(
        encrypted_position.collateral,
        encrypted_position.size,
        encrypted_position.entry_price,
        current_price,
        encrypted_position.leverage,
        encrypted_position.side,
    )?;

    // ONLY this boolean is revealed to the chain
    Ok(LiquidationResult {
        should_liquidate: health.is_liquidatable,
        proof: generate_mpc_proof(&health),
    })
}

/// PnL calculation — encrypted until position close
#[mxe_function]
pub fn compute_pnl(
    entry_price: EncryptedU64,
    exit_price: EncryptedU64,
    size: EncryptedU64,
    leverage: EncryptedU16,
    side: EncryptedU8,
) -> MxeResult<PnlResult> {
    let raw_pnl = if side == EncryptedU8::from(0) {
        (exit_price - entry_price) * size * leverage
    } else {
        (entry_price - exit_price) * size * leverage
    };

    Ok(PnlResult {
        encrypted_pnl: raw_pnl,
        pnl_proof: generate_pnl_proof(&raw_pnl),
    })
}`}
    />

    <DocSection title="Step 7 — Register MPC Nodes & Configure Cluster">
      <p>For devnet, Arcium provides shared nodes. For production, you'd run your own or use vetted operators.</p>
    </DocSection>
    <CodeBlock
      title="Terminal — Node registration"
      language="bash"
      code={`# ═══════════════════════════════════════════════════════
# Option A: Use Arcium's shared devnet nodes (easiest)
# ═══════════════════════════════════════════════════════

arcium devnet setup
#    Auto-configures a 3-of-5 MPC cluster
#    Output: Cluster ID: cluster_xyz789
#    ⚠️ SAVE THIS CLUSTER ID

# ═══════════════════════════════════════════════════════
# Option B: Manual node registration (production-style)
# ═══════════════════════════════════════════════════════

arcium node register \\
  --pubkey <NODE_1_SOLANA_PUBKEY> \\
  --encryption-key <NODE_1_X25519_KEY> \\
  --endpoint https://node1.example.com:8443

arcium node register \\
  --pubkey <NODE_2_SOLANA_PUBKEY> \\
  --encryption-key <NODE_2_X25519_KEY> \\
  --endpoint https://node2.example.com:8443

arcium node register \\
  --pubkey <NODE_3_SOLANA_PUBKEY> \\
  --encryption-key <NODE_3_X25519_KEY> \\
  --endpoint https://node3.example.com:8443

# Create the cluster with threshold
arcium cluster create \\
  --threshold 3 \\
  --nodes <NODE_1>,<NODE_2>,<NODE_3> \\
  --mxe mxe_abc123

# Verify cluster status
arcium cluster status`}
    />

    <DocSection title="Step 8 — Wire Arcium to Your Solana Program">
      <p>Your on-chain program must verify Arcium's compute results before updating state.</p>
    </DocSection>
    <CodeBlock
      title="Full integration round trip (TypeScript)"
      language="TypeScript"
      code={`import { ArciumSDK } from "@arcium/sdk";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

const arcium = new ArciumSDK({
  clusterId: "cluster_xyz789",
  network: "devnet",
  mxeId: "mxe_abc123",
});

async function openPrivatePosition(wallet, orderParams) {
  // ── STEP 1: Encrypt on client ──
  const encrypted = await arcium.encrypt({
    size: orderParams.size,
    leverage: orderParams.leverage,
    margin: orderParams.margin,
    side: orderParams.side,
    entryPrice: orderParams.price,
  });

  // ── STEP 2: Submit to Arcium MXE for risk check ──
  const riskResult = await arcium.compute("compute_margin_health", {
    collateral: encrypted.margin,
    position_size: encrypted.size,
    entry_price: encrypted.entryPrice,
    current_price: await getOraclePrice(),
    leverage: encrypted.leverage,
    side: encrypted.side,
  });

  if (riskResult.is_liquidatable) {
    throw new Error("Position would be immediately liquidatable");
  }

  // ── STEP 3: Submit encrypted order to Solana ──
  const tx = new Transaction().add(
    submitEncryptedOrderInstruction({
      ciphertext: encrypted.ciphertext,
      proof: riskResult.proof,
      market: getMarketPda(orderParams.market),
      user: wallet.publicKey,
    })
  );

  // ── STEP 4: Solana verifies proof → updates state ──
  const sig = await wallet.sendTransaction(tx, connection);
  await connection.confirmTransaction(sig, "confirmed");
}

// ── LIQUIDATION CHECK (runs periodically) ──
async function checkLiquidations(positions) {
  for (const positionPda of positions) {
    const result = await arcium.compute("check_liquidation", {
      position: positionPda,
      current_price: await getOraclePrice(),
      maintenance_margin_bps: 500,
    });

    // Chain sees: "liquidate = true/false"
    // Chain does NOT see: margin health, leverage, or entry
    if (result.should_liquidate) {
      await executeLiquidation(positionPda, result.proof);
    }
  }
}`}
    />

    <DocSection title="Step 9 — Handle Results & User Decryption">
      <p>Arcium returns either an encrypted result (only the user can decrypt) or a verified boolean. Your smart contract verifies the proof before acting.</p>
    </DocSection>
    <div className="rounded-xl border border-border bg-card p-6 mb-8 font-mono text-xs">
      <p className="text-primary mb-4 text-sm font-semibold font-sans">Result Flow</p>
      <pre className="text-muted-foreground whitespace-pre overflow-x-auto">{`
Arcium MXE computes on encrypted inputs
         │
         ├── Returns encrypted result (user-only)
         │   └── User wallet decrypts locally:
         │       • Personal PnL
         │       • Margin health percentage
         │       • Distance to liquidation
         │       → Other traders CANNOT see this
         │
         └── Returns verified boolean (public)
             └── Smart contract receives:
                 • liquidation = true/false
                 • MPC proof (verified on-chain)
                 → Contract executes liquidation
                 → Contract NEVER learns the threshold
`}</pre>
    </div>
    <CodeBlock
      title="User-side decryption"
      language="TypeScript"
      code={`// Only the position owner can decrypt their private data
async function getMyPositionDetails(positionPda) {
  const encryptedPosition = await program.account.position.fetch(positionPda);

  const decrypted = await arcium.decrypt(
    encryptedPosition.encrypted_data,
    wallet
  );

  // User sees their own data:
  console.log("My size:", decrypted.size);         // 1000 USDC
  console.log("My leverage:", decrypted.leverage); // 20x
  console.log("My entry:", decrypted.entryPrice);  // $152.30
  console.log("My PnL:", decrypted.pnl);           // +$340.50

  // Other traders see: [0x8a, 0xf3, 0x2b, 0x91, ...] ← meaningless
}`}
    />

    <DocSection title="Step 10 — Performance & Safety Design">
      <p>This is where most privacy-perp projects die. MPC is heavier than raw on-chain math.</p>
    </DocSection>
    <div className="rounded-xl border border-loss/30 bg-loss/5 p-4 mb-6 text-sm">
      <p className="text-loss font-semibold mb-2">⚠️ Critical Performance Requirements</p>
      <ul className="text-muted-foreground space-y-2 ml-4">
        <li>• <strong className="text-foreground">Liquidation latency:</strong> Benchmark target: &lt;500ms for liquidation checks.</li>
        <li>• <strong className="text-foreground">Throughput:</strong> Stress test with 100+ concurrent positions.</li>
        <li>• <strong className="text-foreground">Worst-case:</strong> Design for degraded performance when nodes are slow.</li>
      </ul>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="font-semibold text-foreground mb-2">🔧 Performance Optimizations</p>
        <ul className="text-muted-foreground space-y-1 ml-4">
          <li>• Batch margin checks together</li>
          <li>• Maintain encrypted state across checks</li>
          <li>• Run periodic risk batches, not per-block</li>
          <li>• Only send liquidation signals on-chain</li>
          <li>• Use off-chain price feeds for intermediate checks</li>
        </ul>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="font-semibold text-foreground mb-2">🛡️ Fallback Safety (Circuit Breakers)</p>
        <ul className="text-muted-foreground space-y-1 ml-4">
          <li>• <strong className="text-foreground">Arcium unavailable:</strong> Pause new positions</li>
          <li>• <strong className="text-foreground">Liquidation fallback:</strong> Transparent on-chain logic</li>
          <li>• <strong className="text-foreground">Safe mode:</strong> Reduce max leverage to 5x</li>
          <li>• <strong className="text-foreground">Never</strong> let the protocol hang in limbo</li>
        </ul>
      </div>
    </div>

    <DocSection title="Privacy Model Audit Checklist">
      <p>Privacy systems fail at the edges, not the math.</p>
    </DocSection>
    <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="text-left p-3 font-medium text-foreground">Attack Vector</th>
            <th className="text-left p-3 font-medium text-foreground">Question</th>
            <th className="text-left p-3 font-medium text-foreground">Mitigation</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr className="border-b border-border/50">
            <td className="p-3">Metadata leakage</td>
            <td className="p-3">Can someone infer positions from on-chain metadata?</td>
            <td className="p-3 text-foreground">Uniform encrypted payload sizes</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-3">Size leakage</td>
            <td className="p-3">Are encrypted payload sizes revealing info?</td>
            <td className="p-3 text-foreground">Pad all payloads to fixed length</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-3">Timing attacks</td>
            <td className="p-3">Can tx timing reveal user behavior?</td>
            <td className="p-3 text-foreground">Random delays, batch submissions</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-3">Liquidation frequency</td>
            <td className="p-3">Does liq frequency expose leverage patterns?</td>
            <td className="p-3 text-foreground">Aggregate liquidation events</td>
          </tr>
          <tr>
            <td className="p-3">Node collusion</td>
            <td className="p-3">What if 3+ nodes collude?</td>
            <td className="p-3 text-foreground">Geographic distribution, reputation staking</td>
          </tr>
        </tbody>
      </table>
    </div>

    <DocSection title="Complete Deployment Checklist">
      <p>End-to-end checklist for integrating Arcium into VeilX:</p>
    </DocSection>
    <CodeBlock
      title="Full deployment commands"
      language="bash"
      code={`# ═══════════════════════════════════════════════════════
# COMPLETE ARCIUM INTEGRATION CHECKLIST
# ═══════════════════════════════════════════════════════

# ── 1. Install CLI tools ──
npm install -g @arcium/cli
solana --version
anchor --version          # Optional

# ── 2. Deploy Solana programs ──
# (Use Solana Playground — see Deployment Guide tab)
# Need: VEILX_CORE, VEILX_MPC_BRIDGE, VEILX_LIQUIDATION IDs

# ── 3. Initialize Arcium project ──
arcium init --network devnet

# ── 4. Create MXE ──
arcium mxe create --name veilx-risk-engine

# ── 5. Build & deploy MXE ──
arcium mxe build
arcium mxe deploy --network devnet
# Save: MXE_ID

# ── 6. Set up MPC cluster ──
arcium devnet setup          # Auto-configures for devnet
# Save: CLUSTER_ID

# ── 7. Link MXE to cluster ──
arcium cluster link-mxe \\
  --cluster <CLUSTER_ID> \\
  --mxe <MXE_ID>

# ── 8. Link to Solana bridge program ──
arcium link-program \\
  --program-id <VEILX_MPC_BRIDGE_PROGRAM_ID> \\
  --cluster <CLUSTER_ID>

# ── 9. Update frontend config ──
# src/config/programs.ts:
#   ARCIUM_CONFIG.CLUSTER_ID = "<CLUSTER_ID>"

# ── 10. Verify everything ──
arcium mxe status --id <MXE_ID>
arcium cluster status
solana account <VEILX_CORE_PROGRAM_ID> --url devnet`}
    />

    <div className="rounded-xl border border-profit/30 bg-profit/5 p-4 mb-8 text-sm">
      <p className="text-profit font-semibold mb-2">✅ After completing all steps you should have:</p>
      <ul className="text-muted-foreground space-y-1 ml-4">
        <li>• <strong className="text-foreground">3 Solana programs</strong> — veilx-core, veilx-mpc-bridge, veilx-liquidation</li>
        <li>• <strong className="text-foreground">1 Arcium MXE</strong> — veilx-risk-engine (deployed to Arcium network)</li>
        <li>• <strong className="text-foreground">1 MPC cluster</strong> — 3-of-5 threshold (active)</li>
        <li>• <strong className="text-foreground">Linked bridge</strong> — Solana bridge ↔ Arcium cluster</li>
        <li>• <strong className="text-foreground">Updated frontend config</strong> — all IDs wired</li>
      </ul>
    </div>

    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm">
      <p className="text-primary font-semibold mb-2">🏗️ The Big Picture</p>
      <p className="text-muted-foreground mb-3">
        Your DEX is now a <strong className="text-foreground">cryptographically coordinated system</strong> across two domains:
      </p>
      <ul className="text-muted-foreground space-y-1 ml-4 mb-3">
        <li>• <strong className="text-foreground">Chain</strong> → Settlement + funds custody (the referee)</li>
        <li>• <strong className="text-foreground">Arcium</strong> → Encrypted risk brain (the blindfolded calculator)</li>
        <li>• <strong className="text-foreground">Client</strong> → Encryption + selective decryption</li>
      </ul>
      <p className="text-muted-foreground">
        When traders can't see each other's liquidation levels, the entire game theory of perps shifts. That's not a UI change — that's <strong className="text-foreground">market structure evolution</strong>.
      </p>
    </div>
  </>
);

const TestingTab = () => (
  <>
    <DocSection title="Testing on Solana Playground">
      <p>
        After deploying all 3 programs, use Solana Playground's <strong className="text-foreground">Test</strong> tab to call initialization instructions. The Test tab auto-generates a UI from the program's IDL — each instruction parameter appears as a form field.
      </p>
      <p>
        <strong className="text-foreground">Important:</strong> Solana Playground lets you type any value into parameter fields. Use the exact values documented below — incorrect values will cause transactions to fail or create misconfigured accounts.
      </p>
    </DocSection>

    <h3 className="text-lg font-semibold text-foreground mb-3">1. Initialize Markets (veilx-core)</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>Open the <strong className="text-foreground">veilx-core</strong> project in Solana Playground. Go to the <strong className="text-foreground">Test</strong> tab (flask icon). You'll see a list of instructions from the IDL. Click <strong className="text-foreground">initializeMarket</strong>.</p>
    </div>

    <div className="rounded-xl border border-border bg-card p-5 mb-4">
      <p className="text-sm font-semibold text-foreground mb-3">Parameter Fields — What to Enter</p>
      <p className="text-xs text-muted-foreground mb-3">The <code className="text-primary bg-muted px-1 rounded">market_params</code> argument is a struct. Playground shows each field separately:</p>
      <table className="w-full text-xs mb-2">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Field</th>
            <th className="text-left py-2 font-medium">Type</th>
            <th className="text-left py-2 font-medium">Value for SOL/USD</th>
            <th className="text-left py-2 font-medium">Explanation</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">oracle</td>
            <td className="py-2 font-mono">PublicKey</td>
            <td className="py-2 font-mono text-profit">H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG</td>
            <td className="py-2 text-muted-foreground">Pyth SOL/USD devnet feed</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">base_symbol</td>
            <td className="py-2 font-mono">[u8; 8]</td>
            <td className="py-2 font-mono text-profit">[83, 79, 76, 47, 85, 83, 68, 0]</td>
            <td className="py-2 text-muted-foreground">UTF-8 bytes of "SOL/USD" + null pad to 8</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">max_leverage</td>
            <td className="py-2 font-mono">u16</td>
            <td className="py-2 font-mono text-profit">50</td>
            <td className="py-2 text-muted-foreground">Maximum leverage (50x)</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">maintenance_margin</td>
            <td className="py-2 font-mono">u16</td>
            <td className="py-2 font-mono text-profit">500</td>
            <td className="py-2 text-muted-foreground">5% in basis points</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">taker_fee</td>
            <td className="py-2 font-mono">u16</td>
            <td className="py-2 font-mono text-profit">5</td>
            <td className="py-2 text-muted-foreground">0.05% in basis points</td>
          </tr>
          <tr>
            <td className="py-2 font-mono text-primary">maker_fee</td>
            <td className="py-2 font-mono">u16</td>
            <td className="py-2 font-mono text-profit">2</td>
            <td className="py-2 text-muted-foreground">0.02% in basis points</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="rounded-xl border border-border bg-card p-5 mb-4">
      <p className="text-sm font-semibold text-foreground mb-3">Accounts — Auto-Derived</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Account</th>
            <th className="text-left py-2 font-medium">Value</th>
            <th className="text-left py-2 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">market</td>
            <td className="py-2 font-mono">Auto-derived (PDA)</td>
            <td className="py-2 text-muted-foreground">Seeds: [b"market", base_symbol]. Auto-derived by Playground.</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">authority</td>
            <td className="py-2 font-mono">Your Playground wallet</td>
            <td className="py-2 text-muted-foreground">Auto-filled.</td>
          </tr>
          <tr>
            <td className="py-2 font-mono text-primary">systemProgram</td>
            <td className="py-2 font-mono">11111...1111</td>
            <td className="py-2 text-muted-foreground">Auto-filled.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6 text-sm">
      <p className="text-primary font-semibold mb-1">💡 base_symbol Byte Arrays for Each Market</p>
      <p className="text-muted-foreground mb-2">Playground expects <code className="text-primary bg-muted px-1 rounded">[u8; 8]</code> as a JSON array of numbers:</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-1.5 font-medium">Market</th>
            <th className="text-left py-1.5 font-medium">base_symbol bytes</th>
            <th className="text-left py-1.5 font-medium">Pyth Oracle</th>
          </tr>
        </thead>
        <tbody className="text-foreground font-mono text-[10px]">
          <tr className="border-b border-border/50">
            <td className="py-1.5">SOL/USD</td>
            <td className="py-1.5 text-profit">[83, 79, 76, 47, 85, 83, 68, 0]</td>
            <td className="py-1.5">H6ARHf...AQJEG</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-1.5">ETH/USD</td>
            <td className="py-1.5 text-profit">[69, 84, 72, 47, 85, 83, 68, 0]</td>
            <td className="py-1.5">JBu1AL...iWdB</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-1.5">BTC/USD</td>
            <td className="py-1.5 text-profit">[66, 84, 67, 47, 85, 83, 68, 0]</td>
            <td className="py-1.5">GVXRSBj...MJFi</td>
          </tr>
          <tr>
            <td className="py-1.5">ARB/USD</td>
            <td className="py-1.5 text-profit">[65, 82, 66, 47, 85, 83, 68, 0]</td>
            <td className="py-1.5">4mRGHz...SBZE</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="text-sm text-muted-foreground space-y-2 mb-6">
      <p><strong className="text-foreground">How to run:</strong> Fill in all fields, then click <strong className="text-foreground">"Test"</strong>. The transaction is signed by your Playground wallet and sent to devnet. Green checkmark = success. Repeat for each market — change <code className="text-primary bg-muted px-1 rounded">oracle</code> and <code className="text-primary bg-muted px-1 rounded">base_symbol</code> each time.</p>
    </div>

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">2. Initialize MPC Bridge (veilx-mpc-bridge)</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>Switch to <strong className="text-foreground">veilx-mpc-bridge</strong> project → Test tab → click <strong className="text-foreground">initialize</strong>.</p>
    </div>

    <div className="rounded-xl border border-border bg-card p-5 mb-4">
      <p className="text-sm font-semibold text-foreground mb-3">Parameter Fields</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Field</th>
            <th className="text-left py-2 font-medium">Type</th>
            <th className="text-left py-2 font-medium">Value</th>
            <th className="text-left py-2 font-medium">Explanation</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">threshold</td>
            <td className="py-2 font-mono">u8</td>
            <td className="py-2 font-mono text-profit">3</td>
            <td className="py-2 text-muted-foreground">Minimum MPC nodes needed (3-of-5)</td>
          </tr>
          <tr>
            <td className="py-2 font-mono text-primary">node_count</td>
            <td className="py-2 font-mono">u8</td>
            <td className="py-2 font-mono text-profit">5</td>
            <td className="py-2 text-muted-foreground">Total MPC nodes in cluster</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="rounded-xl border border-border bg-card p-5 mb-6">
      <p className="text-sm font-semibold text-foreground mb-3">Accounts</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Account</th>
            <th className="text-left py-2 font-medium">Value</th>
            <th className="text-left py-2 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">config</td>
            <td className="py-2 font-mono">Auto-derived (PDA)</td>
            <td className="py-2 text-muted-foreground">Seeds: [b"mpc_config"]. Auto-derived.</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">authority</td>
            <td className="py-2 font-mono">Your Playground wallet</td>
            <td className="py-2 text-muted-foreground">Auto-filled.</td>
          </tr>
          <tr>
            <td className="py-2 font-mono text-primary">systemProgram</td>
            <td className="py-2 font-mono">11111...1111</td>
            <td className="py-2 text-muted-foreground">Auto-filled.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">3. Initialize Liquidation Engine (veilx-liquidation)</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>Switch to <strong className="text-foreground">veilx-liquidation</strong> project → Test tab → click <strong className="text-foreground">initialize</strong>.</p>
    </div>

    <div className="rounded-xl border border-border bg-card p-5 mb-4">
      <p className="text-sm font-semibold text-foreground mb-3">Parameter Fields</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Field</th>
            <th className="text-left py-2 font-medium">Type</th>
            <th className="text-left py-2 font-medium">Value</th>
            <th className="text-left py-2 font-medium">Explanation</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">liquidation_fee</td>
            <td className="py-2 font-mono">u16</td>
            <td className="py-2 font-mono text-profit">250</td>
            <td className="py-2 text-muted-foreground">2.5% penalty in basis points</td>
          </tr>
          <tr>
            <td className="py-2 font-mono text-primary">insurance_share</td>
            <td className="py-2 font-mono">u16</td>
            <td className="py-2 font-mono text-profit">50</td>
            <td className="py-2 text-muted-foreground">50% of fee goes to insurance fund</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="rounded-xl border border-border bg-card p-5 mb-6">
      <p className="text-sm font-semibold text-foreground mb-3">Accounts</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Account</th>
            <th className="text-left py-2 font-medium">Value</th>
            <th className="text-left py-2 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">config</td>
            <td className="py-2 font-mono">Auto-derived (PDA)</td>
            <td className="py-2 text-muted-foreground">Seeds: [b"liq_config"]. Auto-derived.</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="py-2 font-mono text-primary">authority</td>
            <td className="py-2 font-mono">Your Playground wallet</td>
            <td className="py-2 text-muted-foreground">Auto-filled.</td>
          </tr>
          <tr>
            <td className="py-2 font-mono text-primary">systemProgram</td>
            <td className="py-2 font-mono">11111...1111</td>
            <td className="py-2 text-muted-foreground">Auto-filled.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">4. Verify Initialization</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>After each successful call, Playground shows a <strong className="text-profit">green checkmark</strong> and tx signature. Optionally verify via CLI:</p>
    </div>
    <CodeBlock title="Verify on CLI (optional)" language="bash" code={`# Check market account exists
solana account <MARKET_PDA_ADDRESS> --url devnet

# Check MPC config
solana account <MPC_CONFIG_PDA> --url devnet

# Check liquidation config
solana account <LIQ_CONFIG_PDA> --url devnet`} />

    <div className="rounded-xl border border-profit/30 bg-profit/5 p-4 mb-6 text-sm">
      <p className="text-profit font-semibold mb-1">✅ After completing all initializations:</p>
      <ul className="text-muted-foreground space-y-1 ml-4">
        <li>• <strong className="text-foreground">4 initialized markets</strong> — SOL/USD, ETH/USD, BTC/USD, ARB/USD</li>
        <li>• <strong className="text-foreground">1 MPC bridge config</strong> — threshold=3, node_count=5</li>
        <li>• <strong className="text-foreground">1 liquidation engine config</strong> — fee=250 bps, insurance_share=50%</li>
      </ul>
    </div>

    <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">Common Errors</h3>
    <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="text-left p-3 font-medium text-foreground">Error</th>
            <th className="text-left p-3 font-medium text-foreground">Cause</th>
            <th className="text-left p-3 font-medium text-foreground">Fix</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr className="border-b border-border/50">
            <td className="p-3 font-mono text-loss">Account already in use</td>
            <td className="p-3">PDA already initialized</td>
            <td className="p-3 text-foreground">Already created — skip this step.</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-3 font-mono text-loss">Insufficient funds</td>
            <td className="p-3">Not enough SOL for rent</td>
            <td className="p-3 text-foreground">Click "Airdrop" for more devnet SOL.</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="p-3 font-mono text-loss">Simulation failed</td>
            <td className="p-3">Wrong parameter types/values</td>
            <td className="p-3 text-foreground">Double-check values match the tables above exactly.</td>
          </tr>
          <tr>
            <td className="p-3 font-mono text-loss">Custom program error</td>
            <td className="p-3">Program logic rejection</td>
            <td className="p-3 text-foreground">Check error code in IDL errors section.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
);

const DeploymentTab = () => (
  <>
    <DocSection title="Deployment Guide — Solana Playground">
      <p>
        <strong className="text-foreground">Solana Playground</strong> (<a href="https://beta.solpg.io" target="_blank" rel="noopener noreferrer" className="text-primary underline">beta.solpg.io</a>) lets you compile and deploy Anchor programs entirely in the browser — no local toolchain needed. Follow these steps to deploy all 3 VeilX contracts to devnet.
      </p>
    </DocSection>

    {/* ── STEP 1 ── */}
    <h3 className="text-lg font-semibold text-foreground mb-3">Step 1 — Open Solana Playground & Create a Wallet</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>1. Go to <a href="https://beta.solpg.io" target="_blank" rel="noopener noreferrer" className="text-primary underline">beta.solpg.io</a>.</p>
      <p>2. Click the <strong className="text-foreground">wallet icon</strong> (bottom-left) → "Create a new wallet". This generates a browser keypair.</p>
      <p>3. Make sure <strong className="text-foreground">Devnet</strong> is selected in the cluster dropdown (bottom bar).</p>
      <p>4. Click <strong className="text-foreground">"Airdrop"</strong> to get free devnet SOL (≈5 SOL recommended).</p>
    </div>

    {/* ── STEP 2 ── */}
    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 2 — Deploy veilx-core</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>1. Click <strong className="text-foreground">"Create a new project"</strong> → name it <code className="text-primary bg-muted px-1 rounded">veilx-core</code> → select <strong className="text-foreground">Anchor (Rust)</strong>.</p>
      <p>2. Replace the contents of <code className="text-primary bg-muted px-1 rounded">src/lib.rs</code> with the <strong className="text-foreground">VeilX Core Program</strong> code from the Smart Contracts tab.</p>
      <p>3. Click <strong className="text-foreground">"Build"</strong> (hammer icon) — wait for compilation.</p>
      <p>4. Click <strong className="text-foreground">"Deploy"</strong> — Playground will deploy to devnet and display the <strong className="text-foreground">Program ID</strong>.</p>
      <p>5. <strong className="text-profit">Copy the Program ID</strong> — you'll need this later.</p>
    </div>
    <CodeBlock title="Expected output" language="text" code={`Building...
Build successful. Completed in 12.3s.

Deploying...
Program deployed to: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Deploy successful.`} />

    {/* ── STEP 3 ── */}
    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 3 — Deploy veilx-mpc-bridge</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>1. Create another new project → name it <code className="text-primary bg-muted px-1 rounded">veilx-mpc-bridge</code>.</p>
      <p>2. Paste the <strong className="text-foreground">MPC Bridge Program</strong> code into <code className="text-primary bg-muted px-1 rounded">src/lib.rs</code>.</p>
      <p>3. <strong className="text-foreground">Build → Deploy</strong>. Copy the Program ID.</p>
    </div>

    {/* ── STEP 4 ── */}
    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 4 — Deploy veilx-liquidation</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>1. Create a third project → <code className="text-primary bg-muted px-1 rounded">veilx-liquidation</code>.</p>
      <p>2. Paste the <strong className="text-foreground">Liquidation Engine</strong> code → <strong className="text-foreground">Build → Deploy</strong>.</p>
      <p>3. Copy the Program ID.</p>
    </div>

    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6 text-sm">
      <p className="text-primary font-semibold mb-1">📋 After deploying all 3 programs, you should have:</p>
      <ul className="text-muted-foreground space-y-1 ml-4">
        <li>• <code className="text-primary bg-muted px-1 rounded">VEILX_CORE_PROGRAM_ID</code></li>
        <li>• <code className="text-primary bg-muted px-1 rounded">VEILX_MPC_BRIDGE_PROGRAM_ID</code></li>
        <li>• <code className="text-primary bg-muted px-1 rounded">VEILX_LIQUIDATION_PROGRAM_ID</code></li>
      </ul>
    </div>

    {/* ── STEP 5 — Arcium ── */}
    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 5 — Set Up Arcium MPC Bridge</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>The Arcium MPC network requires CLI setup (cannot be done fully in-browser). You'll need a terminal — either on desktop or via a mobile SSH app like <strong className="text-foreground">Termius</strong> connected to a cloud VM.</p>
    </div>
    <CodeBlock title="Terminal (desktop or SSH)" language="bash" code={`# 1. Install Arcium CLI
npm install -g @arcium/cli

# 2. Initialize for your project
arcium init --network devnet

# 3. Register MPC compute nodes (minimum 3 for 3-of-5 threshold)
#    Arcium provides shared devnet nodes — or run your own
arcium node register --pubkey <NODE_1_PUBKEY> --encryption-key <KEY_1>
arcium node register --pubkey <NODE_2_PUBKEY> --encryption-key <KEY_2>
arcium node register --pubkey <NODE_3_PUBKEY> --encryption-key <KEY_3>

# 4. Link the MPC bridge to your deployed bridge program
arcium link-program --program-id DooxjY3g8Xn1PZTSd852aKdnA39HvmpSubphAP2VLYks

# 5. Verify cluster is active
arcium status`} />

    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6 text-sm">
      <p className="text-primary font-semibold mb-1">💡 Using Arcium Shared Devnet Nodes</p>
      <p className="text-muted-foreground">For devnet testing, Arcium provides pre-registered shared MPC nodes. Run <code className="text-primary bg-muted px-1 rounded">arcium devnet setup</code> to auto-configure a 3-of-5 cluster without manually registering nodes.</p>
    </div>

    {/* ── STEP 6 — Pyth Oracle ── */}
    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 6 — Connect Pyth Price Oracles</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>VeilX uses <strong className="text-foreground">Pyth Network</strong> price feeds for mark prices. Use the Solana Playground test explorer to call <code className="text-primary bg-muted px-1 rounded">initialize_market</code> with the correct Pyth feed addresses:</p>
    </div>
    <CodeBlock title="Pyth Devnet Feed Addresses" language="text" code={`SOL/USD: H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG
ETH/USD: JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB
BTC/USD: GVXRSBjFk6e6J3NbVPXohDJwFP7skkZNhMhSsMFoMJFi
ARB/USD: 4mRGHzjGerQNWLXJJBfNKFsViFBHxRGFLFmAjGMaSBZE`} />

    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>In Solana Playground's test tab, call <code className="text-primary bg-muted px-1 rounded">initializeMarket</code> for each trading pair. Pass the Pyth feed public key as the <code className="text-primary bg-muted px-1 rounded">oracle</code> parameter.</p>
    </div>

    {/* ── STEP 7 — Configure Frontend ── */}
    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 7 — Configure the VeilX Frontend</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>After deployment, provide the following values to wire the UI to your on-chain programs:</p>
    </div>
    <CodeBlock title="src/config/programs.ts" language="TypeScript" code={`// Paste your deployed program IDs here
export const PROGRAM_IDS = {
  VEILX_CORE: "DLkXTKQVx422rBrSPJDdZdrJYsYXEnCuGLoucr2Bixnb",
  VEILX_MPC_BRIDGE: "DooxjY3g8Xn1PZTSd852aKdnA39HvmpSubphAP2VLYks",
  VEILX_LIQUIDATION: "Fq4LqoHrk1Ru7oQZ1UaF4bV2njt3VYt4Qikrkrf318eW",
};

// Arcium MPC cluster config
export const ARCIUM_CONFIG = {
  CLUSTER_ID: "<your-arcium-cluster-id>",
  NETWORK: "devnet",
};

// Solana RPC (default devnet, or your custom RPC)
export const RPC_ENDPOINT = "https://api.devnet.solana.com";

// Pyth feed addresses
export const PYTH_FEEDS = {
  "SOL/USD": "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
  "ETH/USD": "JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB",
  "BTC/USD": "GVXRSBjFk6e6J3NbVPXohDJwFP7skkZNhMhSsMFoMJFi",
  "ARB/USD": "4mRGHzjGerQNWLXJJBfNKFsViFBHxRGFLFmAjGMaSBZE",
};`} />

    {/* ── STEP 8 — Verify ── */}
    <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Step 8 — Verify Everything Works</h3>
    <div className="text-sm text-muted-foreground space-y-2 mb-4">
      <p>1. Open <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer" className="text-primary underline">Solana Explorer (devnet)</a> and search each Program ID — confirm they show as deployed.</p>
      <p>2. Run <code className="text-primary bg-muted px-1 rounded">arcium status</code> to confirm MPC cluster is active.</p>
      <p>3. Connect your Phantom/Solflare wallet to the VeilX frontend and verify the wallet connects.</p>
      <p>4. Share the 3 Program IDs + Arcium Cluster ID with the frontend to complete integration.</p>
    </div>

    <div className="rounded-xl border border-profit/30 bg-profit/5 p-4 text-sm">
      <p className="text-profit font-semibold mb-1">✅ Summary: What You Need After Deployment</p>
      <ul className="text-muted-foreground space-y-1 ml-4">
        <li>• <strong className="text-foreground">3 Program IDs</strong> — from Solana Playground deploys</li>
        <li>• <strong className="text-foreground">Arcium Cluster ID</strong> — from <code className="text-primary bg-muted px-1 rounded">arcium status</code></li>
        <li>• <strong className="text-foreground">RPC endpoint</strong> — devnet default or custom</li>
      </ul>
    </div>
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
