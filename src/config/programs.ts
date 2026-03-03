import { PublicKey } from "@solana/web3.js";

// ── Deployed VeilX Solana Programs ───────────────────────────────
export const PROGRAMS = {
  VEILX_CORE:        new PublicKey("DLkXTKQVx422rBrSPJDdZdrJYsYXEnCuGLoucr2Bixnb"),
  VEILX_MPC_BRIDGE:  new PublicKey("DooxjY3g8Xn1PZTSd852aKdnA39HvmpSubphAP2VLYks"),
  VEILX_LIQUIDATION: new PublicKey("Fq4LqoHrk1Ru7oQZ1UaF4bV2njt3VYt4Qikrkrf318eW"),
  VEILX_SWAP:        new PublicKey("92Qp1BiRNjVnqL9cYBNXYv4zQCdDzSycJn2Fia9qVBPh"),
  TEST_USDC_MINT:    new PublicKey("3nCh8MyXJtH55BbLFyL1aZYjwjDpbU3rBmFaPLWq85gK"),
} as const;

// ── Legacy exports for backward compatibility ────────────────────
export const PROGRAM_IDS = {
  VEILX_CORE: "DLkXTKQVx422rBrSPJDdZdrJYsYXEnCuGLoucr2Bixnb",
  VEILX_MPC_BRIDGE: "DooxjY3g8Xn1PZTSd852aKdnA39HvmpSubphAP2VLYks",
  VEILX_LIQUIDATION: "Fq4LqoHrk1Ru7oQZ1UaF4bV2njt3VYt4Qikrkrf318eW",
};

// ── Arcium MXE — Deployed via arcium deploy ──────────────────────
export const ARCIUM_CONFIG = {
  MXE_PROGRAM_ID:  "6v7pGeTvuAusJEr8yG66KtFBSFJ7P64zADfiyrD9o6cy",
  MXE_ID:          "3Qzzw7LEb7Y6X47Y7ntEY4xk1iFSepKcVJfArgQnccqmcqr7Q26Duc8HZrVMpjcQpHyW1w2pA1V5VxHrfxjad3gs",
  CLUSTER_OFFSET:  456,
  NETWORK:         "devnet" as const,
};

// ── Network ───────────────────────────────────────────────────────
export const RPC_ENDPOINT           = "https://api.devnet.solana.com";
export const USDC_DECIMALS          = 6;
export const MAX_LEVERAGE           = 50;
export const TAKER_FEE_BPS          = 5;
export const MAKER_FEE_BPS          = 2;
export const MAINTENANCE_MARGIN_BPS = 500;
export const LIQUIDATION_FEE_BPS    = 250;

export const USDC_MINT = PROGRAMS.TEST_USDC_MINT;
export const NATIVE_SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");
export const SOL_DECIMALS = 9;
export const VEILX_SWAP_PROGRAM = "92Qp1BiRNjVnqL9cYBNXYv4zQCdDzSycJn2Fia9qVBPh";

// ── Pyth Oracle Feeds ─────────────────────────────────────────────
export const PYTH_FEEDS: Record<string, string> = {
  "SOL/USD": "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
  "ETH/USD": "JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB",
  "BTC/USD": "GVXRSBjFk6e6J3NbVPXohDJwFP7skkZNhMhSsMFoMJFi",
  "ARB/USD": "4mRGHzjGerQNWLXJJBfNKFsViFBHxRGFLFmAjGMaSBZE",
};

// ── Market PDA Utilities ──────────────────────────────────────────
export function getMarketPda(marketName: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("market"), Buffer.from(marketName)],
    new PublicKey(PROGRAM_IDS.VEILX_CORE)
  );
  return pda;
}

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
