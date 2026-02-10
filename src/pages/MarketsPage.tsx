import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { usePriceOracle } from "@/hooks/usePriceOracle";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Layers,
  Loader2,
  Wallet,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MARKETS_META = [
  { symbol: "SOL-PERP", base: "SOL", name: "Solana", fundingRate: 0.0042, openInterest: 245_600_000 },
  { symbol: "ETH-PERP", base: "ETH", name: "Ethereum", fundingRate: -0.0018, openInterest: 580_300_000 },
  { symbol: "BTC-PERP", base: "BTC", name: "Bitcoin", fundingRate: 0.0031, openInterest: 1_820_000_000 },
  { symbol: "ARB-PERP", base: "ARB", name: "Arbitrum", fundingRate: -0.0055, openInterest: 38_500_000 },
];

const WALLET_TOKENS = [
  { symbol: "USDC", name: "USD Coin", balance: 12450.0, icon: "💵" },
  { symbol: "SOL", name: "Solana", balance: 85.2, icon: "◎" },
  { symbol: "ETH", name: "Ethereum", balance: 2.1, icon: "⟠" },
  { symbol: "BTC", name: "Bitcoin", balance: 0.045, icon: "₿" },
  { symbol: "ARB", name: "Arbitrum", balance: 3200, icon: "🔵" },
];

const fmt = (v: number) => {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
  return `$${v.toLocaleString()}`;
};

const MarketsPage = () => {
  const { prices, loading } = usePriceOracle(30_000);
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Markets</h1>
              <p className="text-sm text-muted-foreground mt-1">Live perpetual markets &amp; wallet overview</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />
              Live — CoinGecko + Pyth
            </div>
          </div>

          <Tabs defaultValue="perpetuals">
            <TabsList className="bg-muted w-full justify-start mb-6">
              <TabsTrigger value="perpetuals" className="flex items-center gap-1.5 text-xs">
                <BarChart3 className="h-3 w-3" />
                Perpetual Markets
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-1.5 text-xs">
                <Wallet className="h-3 w-3" />
                Wallet Tokens
              </TabsTrigger>
            </TabsList>

            <TabsContent value="perpetuals">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="text-muted-foreground border-b border-border bg-muted/30">
                          <th className="text-left py-3 px-4 font-medium">Market</th>
                          <th className="text-right py-3 px-4 font-medium">Price</th>
                          <th className="text-right py-3 px-4 font-medium">24h Change</th>
                          <th className="text-right py-3 px-4 font-medium">24h Volume</th>
                          <th className="text-right py-3 px-4 font-medium">Funding Rate</th>
                          <th className="text-right py-3 px-4 font-medium">Open Interest</th>
                          <th className="text-right py-3 px-4 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {MARKETS_META.map((m) => {
                          const p = prices[m.base];
                          const change = p?.change24h ?? 0;
                          return (
                            <tr
                              key={m.symbol}
                              className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                                    {m.base.slice(0, 1)}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground text-sm">{m.symbol}</div>
                                    <div className="text-muted-foreground text-[10px]">{m.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right text-foreground font-semibold text-sm">
                                ${p?.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "—"}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span
                                  className={`inline-flex items-center gap-1 font-semibold ${
                                    change >= 0 ? "text-profit" : "text-loss"
                                  }`}
                                >
                                  {change >= 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                  {change >= 0 ? "+" : ""}
                                  {change.toFixed(2)}%
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right text-secondary-foreground">
                                {p ? fmt(p.volume24h) : "—"}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span
                                  className={`font-semibold ${
                                    m.fundingRate >= 0 ? "text-profit" : "text-loss"
                                  }`}
                                >
                                  {m.fundingRate >= 0 ? "+" : ""}
                                  {(m.fundingRate * 100).toFixed(4)}%
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right text-secondary-foreground">
                                {fmt(m.openInterest)}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <Link
                                  to="/trade"
                                  className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors"
                                >
                                  Trade
                                  <ArrowUpRight className="h-3 w-3" />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="wallet">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {!connected ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Wallet className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Connect your wallet to view token balances</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="text-muted-foreground border-b border-border bg-muted/30">
                          <th className="text-left py-3 px-4 font-medium">Token</th>
                          <th className="text-right py-3 px-4 font-medium">Balance</th>
                          <th className="text-right py-3 px-4 font-medium">Price</th>
                          <th className="text-right py-3 px-4 font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WALLET_TOKENS.map((t) => {
                          const p = prices[t.symbol];
                          const price = t.symbol === "USDC" ? 1 : p?.price ?? 0;
                          const value = t.balance * price;
                          return (
                            <tr
                              key={t.symbol}
                              className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{t.icon}</span>
                                  <div>
                                    <div className="font-semibold text-foreground text-sm">{t.symbol}</div>
                                    <div className="text-muted-foreground text-[10px]">{t.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right text-foreground font-semibold">
                                {t.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                              </td>
                              <td className="py-4 px-4 text-right text-secondary-foreground">
                                ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-4 text-right text-foreground font-semibold">
                                ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MarketsPage;
