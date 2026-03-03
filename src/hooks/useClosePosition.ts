import { useCallback, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { useVeilXProgram } from "./useVeilXProgram";
import {
  createArciumCipher,
  getArciumAccounts,
  waitForMPC,
} from "@/lib/arcium";

export function useClosePosition() {
  const program        = useVeilXProgram();
  const wallet         = useAnchorWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<"idle"|"processing"|"confirmed"|"error">("idle");

  const closePosition = useCallback(async ({
    exitPrice,
    sizeUsd,
    entryPrice,
    isLong,
  }: {
    exitPrice:  number;
    sizeUsd:    number;
    entryPrice: number;
    isLong:     boolean;
  }) => {
    if (!wallet || !program) throw new Error("Wallet not connected");
    setStatus("processing");

    try {
      const provider = new AnchorProvider(
        connection, wallet, { commitment: "confirmed" }
      );
      const { cipher, pubKey } = await createArciumCipher(provider);

      const nonce      = crypto.getRandomValues(new Uint8Array(16));
      const client     = await import("@arcium-hq/client");
      const ciphertext = cipher.encrypt(
        [BigInt(sizeUsd), BigInt(entryPrice), BigInt(exitPrice), BigInt(isLong ? 1 : 0)],
        nonce
      );
      const compOffset = new BN(crypto.getRandomValues(new Uint8Array(8)));
      const nonceBN    = new BN(client.deserializeLE(nonce).toString());

      const tx = await program.methods
        .closePosition(
          compOffset,
          Array.from(ciphertext[0]),
          Array.from(pubKey),
          nonceBN
        )
        .accountsPartial(await getArciumAccounts(compOffset, "compute_pnl"))
        .rpc({ commitment: "confirmed" });

      await waitForMPC(provider, compOffset);
      setStatus("confirmed");
      return { tx, cipher, nonce };
    } catch (e: any) {
      setStatus("error");
      throw e;
    }
  }, [program, wallet, connection]);

  return { closePosition, status };
}
