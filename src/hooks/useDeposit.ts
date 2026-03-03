import { useCallback, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { useVeilXProgram } from "./useVeilXProgram";
import { createArciumCipher, getArciumAccounts, waitForMPC } from "@/lib/arcium";
import { USDC_DECIMALS } from "@/config/programs";

export function useDeposit() {
  const program        = useVeilXProgram();
  const wallet         = useAnchorWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  const deposit = useCallback(async (amountUsdc: number) => {
    if (!wallet || !program) throw new Error("Wallet not connected");
    setLoading(true);

    try {
      const provider = new AnchorProvider(
        connection, wallet, { commitment: "confirmed" }
      );
      const { cipher, pubKey } = await createArciumCipher(provider);

      const nonce     = crypto.getRandomValues(new Uint8Array(16));
      const client    = await import("@arcium-hq/client");
      const amountRaw = BigInt(Math.floor(amountUsdc * 10 ** USDC_DECIMALS));
      const ciphertext = cipher.encrypt([amountRaw], nonce);
      const compOffset = new BN(crypto.getRandomValues(new Uint8Array(8)));
      const nonceBN    = new BN(client.deserializeLE(nonce).toString());

      const tx = await program.methods
        .deposit(
          new BN(amountRaw.toString()),
          compOffset,
          Array.from(ciphertext[0]),
          Array.from(pubKey),
          nonceBN
        )
        .accountsPartial(await getArciumAccounts(compOffset, "deposit"))
        .rpc({ commitment: "confirmed" });

      await waitForMPC(provider, compOffset);
      return tx;
    } finally {
      setLoading(false);
    }
  }, [program, wallet, connection]);

  return { deposit, loading };
}
