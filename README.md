What is VeilX?
VeilX is a private perpetual futures protocol built on Solana that uses Arcium's Multi-Party Computation (MPC) to keep trader intent, positions, and orders fully encrypted. Only final PnL is revealed to the public ledger.

Traditional perp DEXs expose every detail of a trader's activity — entry prices, position sizes, liquidation thresholds, and stop-loss levels are all visible on-chain. This creates attack vectors: MEV bots front-run orders, sophisticated actors copy profitable traders, and liquidation hunters target exposed positions.

VeilX solves this by encrypting all sensitive trading data via Arcium before it reaches the matching engine.

Key Features
Encrypted Orders: All order parameters (size, direction, leverage, limit price) are encrypted client-side before submission.
Private Matching: Arcium MPC nodes match orders on encrypted data — no single node sees plaintext.
Hidden Liquidations: Liquidation checks run privately, preventing targeted liquidation attacks.
Selective Disclosure: Traders choose what to reveal — share PnL for compliance while keeping strategy private.
