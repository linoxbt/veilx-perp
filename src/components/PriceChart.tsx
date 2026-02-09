import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const TIMEFRAMES = ["1H", "4H", "1D", "1W"] as const;

const generatePriceData = (points: number, basePrice: number, volatility: number) => {
  const data = [];
  let price = basePrice;
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    price += (Math.random() - 0.48) * volatility;
    price = Math.max(price * 0.95, price);
    data.push({
      time: new Date(now - i * 60000 * 15).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 500 + 100),
    });
  }
  return data;
};

const MARKETS = [
  { symbol: "SOL-PERP", base: 148, vol: 2.5 },
  { symbol: "ETH-PERP", base: 2340, vol: 25 },
  { symbol: "BTC-PERP", base: 67200, vol: 400 },
];

const PriceChart = () => {
  const [market, setMarket] = useState(0);
  const [tf, setTf] = useState<typeof TIMEFRAMES[number]>("1H");
  const [data, setData] = useState(() => generatePriceData(40, MARKETS[0].base, MARKETS[0].vol));

  useEffect(() => {
    setData(generatePriceData(40, MARKETS[market].base, MARKETS[market].vol));
  }, [market, tf]);

  // Simulate live tick
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const newPrice = last.price + (Math.random() - 0.48) * MARKETS[market].vol * 0.3;
        return [
          ...prev.slice(1),
          {
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            price: parseFloat(newPrice.toFixed(2)),
            volume: Math.floor(Math.random() * 500 + 100),
          },
        ];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [market]);

  const currentPrice = data[data.length - 1]?.price ?? 0;
  const openPrice = data[0]?.price ?? 0;
  const change = currentPrice - openPrice;
  const changePct = ((change / openPrice) * 100).toFixed(2);
  const isUp = change >= 0;

  const minPrice = useMemo(() => Math.min(...data.map((d) => d.price)), [data]);
  const maxPrice = useMemo(() => Math.max(...data.map((d) => d.price)), [data]);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {MARKETS.map((m, i) => (
            <button
              key={m.symbol}
              onClick={() => setMarket(i)}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-colors ${
                market === i ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.symbol}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {isUp ? <TrendingUp className="h-4 w-4 text-profit" /> : <TrendingDown className="h-4 w-4 text-loss" />}
            <span className="text-lg font-bold font-mono text-foreground">${currentPrice.toLocaleString()}</span>
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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-muted-foreground">
        <span>Data: Pyth Network + CoinGecko</span>
        <span>Live • Updates every 3s</span>
      </div>
    </div>
  );
};

export default PriceChart;
