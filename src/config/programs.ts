// ═══════════════════════════════════════════════════════
// VeilX Program Configuration
// Replace placeholder values after deploying to devnet
// ═══════════════════════════════════════════════════════

export const PROGRAM_IDS = {
  VEILX_CORE: "DLkXTKQVx422rBrSPJDdZdrJYsYXEnCuGLoucr2Bixnb",
  VEILX_MPC_BRIDGE: "DooxjY3g8Xn1PZTSd852aKdnA39HvmpSubphAP2VLYks",
  VEILX_LIQUIDATION: "Fq4LqoHrk1Ru7oQZ1UaF4bV2njt3VYt4Qikrkrf318eW",
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

// Market PDAs derived from [b"market", market_name.as_bytes()]
// These are deterministic — derived from the VeilX Core program ID
import { PublicKey } from "@solana/web3.js";

export function getMarketPda(marketName: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("market"), Buffer.from(marketName)],
    new PublicKey(PROGRAM_IDS.VEILX_CORE)
  );
  return pda;
}

// Pre-computed market PDAs for quick access
export const MARKET_PDAS: Record<string, string> = (() => {
  const markets = Object.keys(PYTH_FEEDS);
  const pdas: Record<string, string> = {};
  for (const m of markets) {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("market"), Buffer.from(m)],
      new PublicKey(PROGRAM_IDS.VEILX_CORE)
    );
    pdas[m] = pda.toBase58();
  }
  return pdas;
})();

// ═══════════════════════════════════════════════════════
// VeilX Test USDC (SPL Token)
// Deploy your own mint via: spl-token create-token --decimals 6
// Then mint tokens:         spl-token mint <MINT_ADDRESS> 1000000
// Replace the address below with your deployed mint address.
// ═══════════════════════════════════════════════════════
export const USDC_MINT = new PublicKey("VXUsdcTESTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
export const USDC_DECIMALS = 6;

// Native SOL mint (for wrapping SOL → wSOL)
export const NATIVE_SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");
export const SOL_DECIMALS = 9;

// VeilX Swap Program ID — handles SOL↔USDC swaps with MPC privacy
export const VEILX_SWAP_PROGRAM = "VXSwapxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
