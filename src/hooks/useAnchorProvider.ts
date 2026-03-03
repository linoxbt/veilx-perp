import { useMemo } from "react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

export function useAnchorProvider() {
  const wallet         = useAnchorWallet();
  const { connection } = useConnection();

  return useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, { commitment: "confirmed" });
  }, [wallet, connection]);
}
