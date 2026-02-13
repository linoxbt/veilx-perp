
# VeilX Enhancement Plan

## Summary
This plan covers 5 areas: (1) Liquidation Engine Dashboard, (2) Order Matching Visualization, (3) Comprehensive Docs Overhaul, (4) Docs Logo Fix, and (5) Faucet Fix + Protocol Status Assessment.

---

## 1. Liquidation Engine Dashboard

Add a new "Liquidation" section to the Portfolio page sidebar and create a dedicated `LiquidationDashboard` component.

**What it shows:**
- Real-time liquidation monitoring panel with simulated encrypted health indicators
- Per-position margin health bars with "encrypted" visual treatment (redacted values for other traders, visible to owner)
- Liquidation queue visualization showing positions approaching threshold
- Stats: Total Liquidations, Insurance Fund Balance, Liquidation Fee Rate, Active Monitors
- Arcium MPC shield indicator showing that liquidation checks run privately
- A table of recent liquidation events (simulated for devnet)

**Technical approach:**
- New component: `src/components/LiquidationDashboard.tsx`
- Add "Liquidation" entry to Portfolio sidebar sections
- Uses existing price oracle hook for mark prices
- Simulated health indicators with animated progress bars that show encrypted/redacted states

---

## 2. Order Matching Visualization

Add an "Order Matching" section to the Portfolio page that visualizes how encrypted orders flow through Arcium MPC.

**What it shows:**
- Animated step-by-step flow: Encrypt -> Secret Share -> MPC Match -> Settle
- Visual representation of encrypted order pairs being matched without revealing details
- Live activity feed showing recent matches (simulated) with encrypted payloads displayed as ciphertext blobs
- Stats: Orders Matched, Avg Match Time, MPC Nodes Active, Match Rate

**Technical approach:**
- New component: `src/components/OrderMatchingViz.tsx`
- Add "Order Matching" entry to Portfolio sidebar
- CSS animations for the data flow visualization
- Simulated matching events with encrypted visual treatment

---

## 3. Comprehensive Docs Overhaul

The current docs have good technical content but are missing explanations of many user-facing features. The plan is to expand every tab to cover all features comprehensively.

**Overview Tab additions:**
- Protocol statistics section (supported markets, max leverage, fee tiers)
- Glossary of key terms (PDA, MPC, MXE, Perp, Funding Rate, etc.)
- Links to all other doc sections

**Architecture Tab additions:**
- Detailed explanation of each layer (Client, Arcium, Solana) with what data lives where
- Margin account model explanation (cross-margin, maintenance requirements)
- Position lifecycle diagram (open -> monitor -> liquidate/close)

**Smart Contracts Tab additions:**
- Update the example mint address from `4zMMC9...` to the actual deployed `3nCh8MyXJtH55BbLFyL1aZYjwjDpbU3rBmFaPLWq85gK` in the USDC deployment guide
- Add explanations for each contract function (not just code blocks)

**New "Features" Tab:**
- Trading Terminal: Market/Limit orders, leverage, TP/SL, order types
- Portfolio Dashboard: Margin accounts, deposits, withdrawals, swap
- Orderbook: Encrypted depth, MPC-redacted sizes
- Funding Rates: How they work, settlement frequency, privacy model
- Liquidation Engine: How private liquidations work
- Order Matching: How encrypted orders are paired
- Faucet: How to get test USDC
- Wallet Integration: Phantom/Solflare support

**Security Tab additions:**
- Expand with protocol risk parameters (max leverage per market, insurance fund mechanics)
- Add emergency procedures / circuit breaker documentation

---

## 4. Docs Logo Fix

The docs page imports `veilxLogo` from `@/assets/veilx-logo.png` which is the correct latest logo (same as Header). The logo reference is already correct. Will verify it renders properly and ensure consistency.

---

## 5. Faucet Fix + Protocol Status

**Faucet issue:** The current faucet calls `createMintToInstruction(USDC_MINT, ata, publicKey, mintAmount)` which uses `publicKey` (the connected wallet) as the mint authority. This only works if the connected Phantom wallet IS the mint authority of the USDC token. Since the token was created from a CLI keypair (`HTGu5FqeD3m2GwfTJA58jj9A5vGfeBVpfPVSb8bZXrNd`), only that keypair can mint.

**Fix options:**
- Update the faucet docs/UI to clearly explain that the faucet only works when the mint authority wallet is connected
- Add a devnet SOL airdrop button alongside (using `connection.requestAirdrop`)
- Improve error messaging for non-authority wallets

**Protocol status assessment (displayed in docs):**
Add a "Protocol Status" section showing what is deployed vs. what remains:

| Component | Status |
|-----------|--------|
| VeilX Core (Solana) | Deployed |
| VeilX MPC Bridge (Solana) | Deployed |
| VeilX Liquidation (Solana) | Deployed |
| VeilX Swap (Solana) | Deployed |
| VeilX Test USDC Mint | Created |
| Arcium MXE Risk Engine | Pending (requires Arcium SDK release) |
| Arcium Cluster Setup | Pending (requires Arcium CLI) |
| Market Initialization (4 pairs) | Manual step via Playground |
| Swap Pool Initialization | Manual step via Playground |
| Frontend Config | Complete |

---

## Files to Create
- `src/components/LiquidationDashboard.tsx` -- Liquidation monitoring UI
- `src/components/OrderMatchingViz.tsx` -- Order matching visualization

## Files to Modify
- `src/pages/PortfolioPage.tsx` -- Add Liquidation and Order Matching sidebar sections
- `src/pages/DocsPage.tsx` -- Comprehensive docs overhaul, add Features tab, fix mint addresses, add protocol status, expand all tabs

## Estimated Scope
This is a large update touching primarily the Portfolio page (2 new sections) and a significant docs rewrite. No breaking changes to existing trading functionality.
