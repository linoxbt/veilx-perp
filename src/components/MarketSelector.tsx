import { useState } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Activity, BarChart3, Layers } from "lucide-react";

const MARKETS = [
  {
    symbol: "SOL-PERP",
    name: "Solana",
    price: 148.32,
    change24h: 3.42,
    fundingRate: 0.0042,
    volume24h: 892_400_000,
    openInterest: 245_600_000,
  },
  {
    symbol: "ETH-PERP",
    name: "Ethereum",
    price: 2346.8,
    change24h: -1.18,
    fundingRate: -0.0018,
    volume24h: 1_240_000_000,
    openInterest: 580_300_000,
  },
  {
    symbol: "BTC-PERP",
    name: "Bitcoin",
    price: 67842.5,
    change24h: 0.87,
    fundingRate: 0.0031,
    volume24h: 3_150_000_000,
    openInterest: 1_820_000_000,
  },
  {
    symbol: "ARB-PERP",
    name: "Arbitrum",
    price: 1.24,
    change24h: -2.65,
    fundingRate: -0.0055,
    volume24h: 142_000_000,
    openInterest: 38_500_000,
  },
];

const formatVolume = (v: number) => {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  return `$${(v / 1e6).toFixed(0)}M`;
};

const MarketSelector = () => {
  const [selected, setSelected] = useState(MARKETS[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-4 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Market Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-2.5 hover:bg-secondary transition-colors min-w-[200px]"
          >
            <div className="text-left">
              <div className="text-sm font-bold text-foreground">{selected.symbol}</div>
              <div className="text-[10px] text-muted-foreground">{selected.name}</div>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-border bg-card p-1.5 shadow-xl z-50">
              {MARKETS.map((m) => (
                <button
                  key={m.symbol}
                  onClick={() => { setSelected(m); setOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    m.symbol === selected.symbol ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <div>
                    <span className="font-semibold">{m.symbol}</span>
                    <span className="text-muted-foreground text-xs ml-2">{m.name}</span>
                  </div>
                  <span className={`text-xs font-mono ${m.change24h >= 0 ? "text-profit" : "text-loss"}`}>
                    {m.change24h >= 0 ? "+" : ""}{m.change24h}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold font-mono text-foreground">
            ${selected.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className={`flex items-center gap-0.5 text-sm font-mono font-semibold ${selected.change24h >= 0 ? "text-profit" : "text-loss"}`}>
            {selected.change24h >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {selected.change24h >= 0 ? "+" : ""}{selected.change24h}%
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 lg:ml-auto text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Funding Rate</div>
              <div className={`font-semibold ${selected.fundingRate >= 0 ? "text-profit" : "text-loss"}`}>
                {selected.fundingRate >= 0 ? "+" : ""}{(selected.fundingRate * 100).toFixed(4)}%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">24h Volume</div>
              <div className="text-foreground font-semibold">{formatVolume(selected.volume24h)}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Open Interest</div>
              <div className="text-foreground font-semibold">{formatVolume(selected.openInterest)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSelector;
