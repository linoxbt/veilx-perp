import { useState, useEffect } from "react";
import { Activity, Clock, TrendingUp, TrendingDown, Lock } from "lucide-react";

interface FundingRate {
  market: string;
  rate: number;
  nextFunding: number; // seconds until next
  predicted: number;
  longPayShort: boolean;
}

const generateFundingRates = (): FundingRate[] => [
  {
    market: "SOL-PERP",
    rate: 0.0042 + (Math.random() - 0.5) * 0.002,
    nextFunding: Math.floor(Math.random() * 3600) + 600,
    predicted: 0.0038 + (Math.random() - 0.5) * 0.002,
    longPayShort: true,
  },
  {
    market: "ETH-PERP",
    rate: -0.0018 + (Math.random() - 0.5) * 0.002,
    nextFunding: Math.floor(Math.random() * 3600) + 600,
    predicted: -0.0022 + (Math.random() - 0.5) * 0.002,
    longPayShort: false,
  },
  {
    market: "BTC-PERP",
    rate: 0.0031 + (Math.random() - 0.5) * 0.002,
    nextFunding: Math.floor(Math.random() * 3600) + 600,
    predicted: 0.0029 + (Math.random() - 0.5) * 0.002,
    longPayShort: true,
  },
  {
    market: "ARB-PERP",
    rate: -0.0055 + (Math.random() - 0.5) * 0.003,
    nextFunding: Math.floor(Math.random() * 3600) + 600,
    predicted: -0.0048 + (Math.random() - 0.5) * 0.003,
    longPayShort: false,
  },
];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
};

const FundingRateDisplay = () => {
  const [rates, setRates] = useState(generateFundingRates);

  useEffect(() => {
    const interval = setInterval(() => {
      setRates(generateFundingRates());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Funding Rates</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono">
          <Lock className="h-3 w-3" />
          Individual exposure encrypted
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-2 font-medium">Market</th>
              <th className="text-right py-2 font-medium">Rate (1h)</th>
              <th className="text-right py-2 font-medium">Predicted</th>
              <th className="text-right py-2 font-medium">Direction</th>
              <th className="text-right py-2 font-medium">Next Funding</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r) => (
              <tr key={r.market} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-2 font-mono font-semibold text-foreground">{r.market}</td>
                <td className={`py-2 text-right font-mono font-semibold ${r.rate >= 0 ? "text-profit" : "text-loss"}`}>
                  {r.rate >= 0 ? "+" : ""}{(r.rate * 100).toFixed(4)}%
                </td>
                <td className={`py-2 text-right font-mono ${r.predicted >= 0 ? "text-profit" : "text-loss"}`}>
                  {r.predicted >= 0 ? "+" : ""}{(r.predicted * 100).toFixed(4)}%
                </td>
                <td className="py-2 text-right">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${r.longPayShort ? "text-loss" : "text-profit"}`}>
                    {r.longPayShort ? (
                      <><TrendingDown className="h-3 w-3" />Longs Pay</>
                    ) : (
                      <><TrendingUp className="h-3 w-3" />Shorts Pay</>
                    )}
                  </span>
                </td>
                <td className="py-2 text-right font-mono text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(r.nextFunding)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 text-[10px] text-muted-foreground">
        <p>Funding rates computed via Arcium MPC — aggregate OI is public, individual exposure remains encrypted. Rates settle every 1 hour.</p>
      </div>
    </div>
  );
};

export default FundingRateDisplay;
