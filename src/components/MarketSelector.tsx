import { useState } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Activity, BarChart3, Layers, Loader2 } from "lucide-react";
import { usePriceOracle } from "@/hooks/usePriceOracle";

const MARKETS_META = [
  { symbol: "SOL-PERP", base: "SOL", name: "Solana", fundingRate: 0.0042, openInterest: 245_600_000 },
  { symbol: "ETH-PERP", base: "ETH", name: "Ethereum", fundingRate: -0.0018, openInterest: 580_300_000 },
  { symbol: "BTC-PERP", base: "BTC", name: "Bitcoin", fundingRate: 0.0031, openInterest: 1_820_000_000 },
  { symbol: "ARB-PERP", base: "ARB", name: "Arbitrum", fundingRate: -0.0055, openInterest: 38_500_000 },
];

const formatVolume = (v: number) => {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  return `$${(v / 1e6).toFixed(0)}M`;
};

const MarketSelector = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const { prices, loading } = usePriceOracle(30_000);

  const selected = MARKETS_META[selectedIdx];
  const livePrice = prices[selected.base];

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
              {MARKETS_META.map((m, i) => {
                const p = prices[m.base];
                const change = p?.change24h ?? 0;
                return (
                  <button
                    key={m.symbol}
                    onClick={() => { setSelectedIdx(i); setOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      i === selectedIdx ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{m.symbol}</span>
                      <span className="text-muted-foreground text-xs ml-2">{m.name}</span>
                    </div>
                    <span className={`text-xs font-mono ${change >= 0 ? "text-profit" : "text-loss"}`}>
                      {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <span className="text-2xl font-bold font-mono text-foreground">
                ${livePrice?.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "—"}
              </span>
              {livePrice && (
                <span className={`flex items-center gap-0.5 text-sm font-mono font-semibold ${livePrice.change24h >= 0 ? "text-profit" : "text-loss"}`}>
                  {livePrice.change24h >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {livePrice.change24h >= 0 ? "+" : ""}{livePrice.change24h.toFixed(2)}%
                </span>
              )}
            </>
          )}
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
              <div className="text-foreground font-semibold">
                {livePrice ? formatVolume(livePrice.volume24h) : "—"}
              </div>
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

      {/* Oracle source tag */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />
          Live — CoinGecko + Pyth Network
        </span>
        {livePrice && (
          <span>Updated {new Date(livePrice.lastUpdated).toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
};

export default MarketSelector;
