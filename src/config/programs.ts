// ═══════════════════════════════════════════════════════
// VeilX Program Configuration
// Replace placeholder values after deploying to devnet
// ═══════════════════════════════════════════════════════

export const PROGRAM_IDS = {
  VEILX_CORE: "<your-veilx-core-program-id>",
  VEILX_MPC_BRIDGE: "<your-veilx-mpc-bridge-program-id>",
  VEILX_LIQUIDATION: "<your-veilx-liquidation-program-id>",
};

export const ARCIUM_CONFIG = {
  CLUSTER_ID: "<your-arcium-cluster-id>",
  NETWORK: "devnet" as const,
};

export const RPC_ENDPOINT = "https://api.devnet.solana.com";

export const PYTH_FEEDS: Record<string, string> = {
  "SOL/USD": "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
  "ETH/USD": "JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB",
  "BTC/USD": "GVXRSBjFk6e6J3NbVPXohDJwFP7skkZNhMhSsMFoMJFi",
  "ARB/USD": "4mRGHzjGerQNWLXJJBfNKFsViFBHxRGFLFmAjGMaSBZE",
};
