import { useMemo } from "react";
import { Program } from "@coral-xyz/anchor";
import { useAnchorProvider } from "./useAnchorProvider";
import IDL from "@/idl/veilx_risk_engine.json";

export function useVeilXProgram() {
  const provider = useAnchorProvider();

  return useMemo(() => {
    if (!provider) return null;
    try {
      return new Program(
        IDL as any,
        provider
      );
    } catch {
      return null;
    }
  }, [provider]);
}
