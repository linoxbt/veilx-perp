import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react";
import { usePriceOracle } from "@/hooks/usePriceOracle";

const TIMEFRAMES = ["1H", "4H", "1D", "1W"] as const;

interface PricePoint {
  time: string;
  price: number;
  volume: number;
}

const MARKETS = [
  { symbol: "SOL-PERP", base: "SOL", label: "SOL-PERP" },
  { symbol: "ETH-PERP", base: "ETH", label: "ETH-PERP" },
  { symbol: "BTC-PERP", base: "BTC", label: "BTC-PERP" },
];

const MAX_POINTS = 60;

const PriceChart = () => {
  const [marketIdx, setMarketIdx] = useState(0);
  const [tf, setTf] = useState<typeof TIMEFRAMES[number]>("1H");
  const { prices, error } = usePriceOracle(2_000);
  const [data, setData] = useState<Record<string, PricePoint[]>>({});
  const lastPriceRef = useRef<Record<string, number>>({});

  const market = MARKETS[marketIdx];
  const livePrice = prices[market.base]?.price ?? 0;
  const source = prices[market.base]?.source ?? "fallback";
  const confidence = prices[market.base]?.confidence ?? 0;

  // Append new price points as they arrive from Pyth
  useEffect(() => {
    if (!livePrice || livePrice === 0) return;

    // Skip if price hasn't changed
    if (lastPriceRef.current[market.base] === livePrice) return;
    lastPriceRef.current[market.base] = livePrice;

    setData((prev) => {
      const existing = prev[market.base] ?? [];
      const newPoint: PricePoint = {
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        price: parseFloat(livePrice.toFixed(2)),
        volume: Math.floor(Math.random() * 500 + 100),
      };
      const updated = [...existing, newPoint].slice(-MAX_POINTS);
      return { ...prev, [market.base]: updated };
    });
  }, [livePrice, market.base]);

  const chartData = data[market.base] ?? [];
  const currentPrice = chartData[chartData.length - 1]?.price ?? livePrice;
  const openPrice = chartData[0]?.price ?? currentPrice;
  const change = currentPrice - openPrice;
  const changePct = openPrice ? ((change / openPrice) * 100).toFixed(2) : "0.00";
  const isUp = change >= 0;

  const minPrice = useMemo(
    () => (chartData.length ? Math.min(...chartData.map((d) => d.price)) : 0),
    [chartData]
  );
  const maxPrice = useMemo(
    () => (chartData.length ? Math.max(...chartData.map((d) => d.price)) : 0),
    [chartData]
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {MARKETS.map((m, i) => (
            <button
              key={m.symbol}
              onClick={() => setMarketIdx(i)}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-colors ${
                marketIdx === i ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {isUp ? <TrendingUp className="h-4 w-4 text-profit" /> : <TrendingDown className="h-4 w-4 text-loss" />}
            <span className="text-lg font-bold font-mono text-foreground">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-mono ${isUp ? "text-profit" : "text-loss"}`}>
              {isUp ? "+" : ""}{changePct}%
            </span>
          </div>

          <div className="flex rounded-lg bg-muted p-0.5">
            {TIMEFRAMES.map((t) => (
              <button
                key={t}
                onClick={() => setTf(t)}
                className={`px-2 py-1 text-[10px] font-mono rounded-md transition-colors ${
                  tf === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        {chartData.length < 2 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-mono">
            <div className="text-center space-y-2">
              <div className="h-2 w-2 rounded-full bg-profit animate-pulse mx-auto" />
              <p>Collecting Pyth price data…</p>
              <p className="text-[10px]">{currentPrice ? `Current: $${currentPrice.toLocaleString()}` : "Waiting for feed"}</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isUp ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(250 16% 14%)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "hsl(245 12% 50%)" }}
                axisLine={{ stroke: "hsl(250 16% 14%)" }}
                tickLine={false}
              />
              <YAxis
                domain={[minPrice * 0.999, maxPrice * 1.001]}
                tick={{ fontSize: 10, fill: "hsl(245 12% 50%)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(250 22% 6%)",
                  border: "1px solid hsl(250 16% 14%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "JetBrains Mono",
                }}
                labelStyle={{ color: "hsl(245 12% 50%)" }}
                itemStyle={{ color: "hsl(240 10% 93%)" }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isUp ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"}
                strokeWidth={2}
                fill="url(#priceGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          {source === "pyth" ? (
            <span className="flex items-center gap-1">
              <Wifi className="h-3 w-3 text-profit" />
              <span className="text-profit">Pyth Network</span>
              {confidence > 0 && (
                <span className="text-muted-foreground">± ${confidence.toFixed(2)}</span>
              )}
            </span>
          ) : error ? (
            <span className="flex items-center gap-1 text-loss">
              <WifiOff className="h-3 w-3" />
              Fallback: CoinGecko
            </span>
          ) : (
            <span>Data: Pyth Network + CoinGecko</span>
          )}
        </div>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />
          Live • {chartData.length} ticks
        </span>
      </div>
    </div>
  );
};

export default PriceChart;
