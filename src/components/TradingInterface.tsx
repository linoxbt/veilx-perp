import { useState } from "react";
import { Lock, TrendingUp, TrendingDown, ShieldCheck } from "lucide-react";

const MOCK_ORDERBOOK = {
  asks: [
    { price: 2348.50, size: 12.4, encrypted: true },
    { price: 2347.80, size: 8.2, encrypted: true },
    { price: 2347.20, size: 25.1, encrypted: false },
    { price: 2346.90, size: 5.7, encrypted: true },
    { price: 2346.40, size: 18.3, encrypted: true },
  ],
  bids: [
    { price: 2345.60, size: 15.8, encrypted: true },
    { price: 2345.10, size: 22.4, encrypted: true },
    { price: 2344.50, size: 9.1, encrypted: false },
    { price: 2343.80, size: 31.2, encrypted: true },
    { price: 2343.20, size: 7.6, encrypted: true },
  ],
};

const MOCK_POSITIONS = [
  { market: "SOL-PERP", side: "Long", size: "150.0", entry: "$148.32", pnl: "+$245.80", pnlPct: "+1.1%", encrypted: true },
  { market: "ETH-PERP", side: "Short", size: "5.2", entry: "$2,351.40", pnl: "-$82.10", pnlPct: "-0.7%", encrypted: true },
];

const TradingInterface = () => {
  const [side, setSide] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState(10);

  return (
        <div className="grid lg:grid-cols-[1fr_320px] gap-4 max-w-5xl mx-auto">
          {/* Main area: orderbook + positions */}
          <div className="space-y-4">
            {/* Orderbook */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Orderbook — SOL-PERP</h3>
                <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
                  <Lock className="h-3 w-3" />
                  MPC Encrypted
                </div>
              </div>

              <div className="grid grid-cols-3 text-xs font-mono text-muted-foreground mb-2 px-2">
                <span>Price</span>
                <span className="text-right">Size</span>
                <span className="text-right">Status</span>
              </div>

              {/* Asks */}
              <div className="space-y-0.5 mb-2">
                {MOCK_ORDERBOOK.asks.map((ask, i) => (
                  <div key={i} className="grid grid-cols-3 text-xs font-mono px-2 py-1 rounded hover:bg-secondary/50 transition-colors">
                    <span className="text-loss">${ask.price.toFixed(2)}</span>
                    <span className="text-right text-secondary-foreground">
                      {ask.encrypted ? "██.██" : ask.size.toFixed(1)}
                    </span>
                    <span className="text-right">
                      {ask.encrypted ? (
                        <Lock className="h-3 w-3 text-primary inline-block" />
                      ) : (
                        <span className="text-muted-foreground">Public</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Spread */}
              <div className="text-center py-2 border-y border-border text-sm font-mono font-bold text-foreground">
                $2,346.00 <span className="text-muted-foreground text-xs ml-2">Spread: $0.80</span>
              </div>

              {/* Bids */}
              <div className="space-y-0.5 mt-2">
                {MOCK_ORDERBOOK.bids.map((bid, i) => (
                  <div key={i} className="grid grid-cols-3 text-xs font-mono px-2 py-1 rounded hover:bg-secondary/50 transition-colors">
                    <span className="text-profit">${bid.price.toFixed(2)}</span>
                    <span className="text-right text-secondary-foreground">
                      {bid.encrypted ? "██.██" : bid.size.toFixed(1)}
                    </span>
                    <span className="text-right">
                      {bid.encrypted ? (
                        <Lock className="h-3 w-3 text-primary inline-block" />
                      ) : (
                        <span className="text-muted-foreground">Public</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Positions */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Your Positions</h3>
                <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
                  <ShieldCheck className="h-3 w-3" />
                  Only You Can See
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-muted-foreground border-b border-border">
                      <th className="text-left py-2 font-medium">Market</th>
                      <th className="text-left py-2 font-medium">Side</th>
                      <th className="text-right py-2 font-medium">Size</th>
                      <th className="text-right py-2 font-medium">Entry</th>
                      <th className="text-right py-2 font-medium">PnL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_POSITIONS.map((pos, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 text-foreground font-semibold">{pos.market}</td>
                        <td className={`py-3 ${pos.side === "Long" ? "text-profit" : "text-loss"}`}>
                          {pos.side}
                        </td>
                        <td className="py-3 text-right text-secondary-foreground">{pos.size}</td>
                        <td className="py-3 text-right text-secondary-foreground">{pos.entry}</td>
                        <td className={`py-3 text-right font-semibold ${pos.pnl.startsWith("+") ? "text-profit" : "text-loss"}`}>
                          {pos.pnl} <span className="text-muted-foreground">{pos.pnlPct}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order form */}
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
        </div>
  );
};

export default TradingInterface;
