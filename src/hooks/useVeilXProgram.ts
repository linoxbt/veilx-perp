import { useMemo } from "react";
import { Program } from "@coral-xyz/anchor";
import { useAnchorProvider } from "./useAnchorProvider";
import { ARCIUM_CONFIG } from "@/config/programs";

// Replace this object with the full contents of:
// veilx_risk_engine/target/idl/veilx_risk_engine.json
// after running: arcium build
const IDL = {
  version: "0.1.0",
  name: "veilx_risk_engine",
  instructions: [],
  accounts: [],
  events: [],
  errors: [],
};

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
