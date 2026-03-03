import { useCallback } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { useVeilXProgram } from "./useVeilXProgram";
import { createArciumCipher, getArciumAccounts, waitForMPC } from "@/lib/arcium";

// Returns ONLY a boolean (should_liquidate: true/false)
// Actual margin ratio and entry price are NEVER revealed on-chain
export function useLiquidationCheck() {
  const program        = useVeilXProgram();
  const wallet         = useAnchorWallet();
  const { connection } = useConnection();

  const checkLiquidation = useCallback(async (currentPrice: number) => {
    if (!wallet || !program) return null;

    const provider = new AnchorProvider(
      connection, wallet, { commitment: "confirmed" }
    );
    const { cipher, pubKey } = await createArciumCipher(provider);

    const nonce      = crypto.getRandomValues(new Uint8Array(16));
    const client     = await import("@arcium-hq/client");
    const ciphertext = cipher.encrypt([BigInt(currentPrice)], nonce);
    const compOffset = new BN(crypto.getRandomValues(new Uint8Array(8)));
    const nonceBN    = new BN(client.deserializeLE(nonce).toString());

    await program.methods
      .checkLiquidation(
        compOffset,
        Array.from(ciphertext[0]),
        Array.from(pubKey),
        nonceBN
      )
      .accountsPartial(await getArciumAccounts(compOffset, "check_liquidation"))
      .rpc({ commitment: "confirmed" });

    await waitForMPC(provider, compOffset);
    return compOffset;
  }, [program, wallet, connection]);

  return { checkLiquidation };
}
