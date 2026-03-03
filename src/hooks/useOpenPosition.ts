import { useCallback, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useVeilXProgram } from "./useVeilXProgram";
import {
  encryptOrder,
  getArciumAccounts,
  waitForMPC,
  type OrderPayload,
} from "@/lib/arcium";

export type PositionStatus =
  | "idle"
  | "encrypting"
  | "submitting"
  | "mpc_processing"
  | "confirmed"
  | "error";

export function useOpenPosition() {
  const program        = useVeilXProgram();
  const wallet         = useAnchorWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<PositionStatus>("idle");
  const [error,  setError]  = useState<string | null>(null);
  const [txSig,  setTxSig]  = useState<string | null>(null);

  const openPosition = useCallback(async (payload: OrderPayload) => {
    if (!wallet) throw new Error("Wallet not connected");
    if (!program) throw new Error("Program not initialized — IDL may be missing");
    setStatus("encrypting");
    setError(null);

    try {
      const provider = new AnchorProvider(
        connection, wallet, { commitment: "confirmed" }
      );

      const { pubKey, ciphertext, compOffset, nonceBN } =
        await encryptOrder(payload, provider);

      setStatus("submitting");

      const tx = await program.methods
        .openPosition(
          compOffset,
          Array.from(ciphertext[0]),
          Array.from(pubKey),
          nonceBN
        )
        .accountsPartial(await getArciumAccounts(compOffset, "open_position"))
        .rpc({ commitment: "confirmed" });

      setTxSig(tx);
      setStatus("mpc_processing");

      await waitForMPC(provider, compOffset);
      setStatus("confirmed");
      return { tx, compOffset };
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
      setStatus("error");
      throw e;
    }
  }, [program, wallet, connection]);

  return { openPosition, status, error, txSig };
}
