import { useWallet } from "@solana/wallet-adapter-react";
import { ShieldCheck } from "lucide-react";
import { ARCIUM_CONFIG } from "@/config/programs";

export function ArciumBadge() {
  const { connected } = useWallet();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
      <ShieldCheck className={`h-4 w-4 ${connected ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-[11px] font-semibold text-primary">Arcium MPC</span>
      <span className="text-[9px] text-muted-foreground font-mono">
        cluster {ARCIUM_CONFIG.CLUSTER_OFFSET} · v0.8.5
      </span>
    </div>
  );
}

export default ArciumBadge;
