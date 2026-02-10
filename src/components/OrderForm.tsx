import { useState } from "react";
import { Lock, TrendingUp, TrendingDown } from "lucide-react";

const OrderForm = () => {
  const [side, setSide] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState(10);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex rounded-lg bg-muted p-1 mb-5">
        <button
          onClick={() => setSide("long")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold transition-all ${
            side === "long" ? "bg-profit text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Long
        </button>
        <button
          onClick={() => setSide("short")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold transition-all ${
            side === "short" ? "bg-loss text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          Short
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Size (SOL)</label>
          <input
            type="text"
            placeholder="0.00"
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Leverage: <span className="text-primary">{leverage}x</span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
            <span>1x</span>
            <span>25x</span>
            <span>50x</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Price (USDC)</label>
          <input
            type="text"
            placeholder="Market"
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start gap-2">
          <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary/80">
            Your order will be encrypted via Arcium MPC before submission. No one can see your position details.
          </p>
        </div>

        <button
          className={`w-full rounded-lg py-3 text-sm font-bold transition-all ${
            side === "long"
              ? "bg-profit text-primary-foreground hover:opacity-90"
              : "bg-loss text-primary-foreground hover:opacity-90"
          }`}
        >
          {side === "long" ? "Open Long" : "Open Short"} — Encrypted
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
