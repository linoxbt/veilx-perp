import { Loader2, Lock, CheckCircle, XCircle, Send, Cpu } from "lucide-react";

export type EncryptionStep =
  | "idle"
  | "encrypting"
  | "submitting"
  | "mpc_processing"
  | "confirmed"
  | "error";

interface Props {
  status: EncryptionStep;
  txSig?: string | null;
  error?: string | null;
}

const STATUS_CONFIG: Record<EncryptionStep, { label: string; icon: any; color: string } | null> = {
  idle:           null,
  encrypting:     { label: "Encrypting order locally — plaintext never leaves your browser", icon: Lock, color: "text-primary" },
  submitting:     { label: "Submitting encrypted order to Solana…", icon: Send, color: "text-primary" },
  mpc_processing: { label: "Arcium MPC cluster processing on ciphertext…", icon: Cpu, color: "text-primary" },
  confirmed:      { label: "Position confirmed on-chain", icon: CheckCircle, color: "text-profit" },
  error:          { label: "Transaction failed", icon: XCircle, color: "text-loss" },
};

export function EncryptionStatus({ status, txSig, error }: Props) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  const Icon = config.icon;
  const isLoading = status === "encrypting" || status === "submitting" || status === "mpc_processing";

  return (
    <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-1.5">
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className={`h-3.5 w-3.5 animate-spin ${config.color}`} />
        ) : (
          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
        )}
        <span className={`text-[11px] font-medium ${config.color}`}>{config.label}</span>
      </div>

      {status === "mpc_processing" && (
        <p className="text-[9px] text-muted-foreground font-mono pl-5">
          MXE: 6v7pGeTvuAusJEr8yG66KtFBSFJ7P64zADfiyrD9o6cy · cluster offset 456
        </p>
      )}

      {txSig && (
        <a
          href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-primary hover:underline pl-5 block"
        >
          View on Solana Explorer ↗
        </a>
      )}

      {error && (
        <p className="text-[10px] text-loss pl-5">{error}</p>
      )}
    </div>
  );
}

export default EncryptionStatus;
