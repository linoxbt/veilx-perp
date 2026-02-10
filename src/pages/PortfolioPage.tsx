import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import TradeHistory from "@/components/TradeHistory";
import AnimatedNumber from "@/components/AnimatedNumber";
import {
  ShieldCheck,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  BarChart3,
  History,
  Lock,
  Eye,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MOCK_POSITIONS = [
  { market: "SOL-PERP", side: "Long", size: "150.0", entry: "$148.32", mark: "$150.10", pnl: 245.8, pnlPct: 1.1, leverage: "10x", liqPrice: "$133.49" },
  { market: "ETH-PERP", side: "Short", size: "5.2", entry: "$2,351.40", mark: "$2,367.20", pnl: -82.1, pnlPct: -0.7, leverage: "5x", liqPrice: "$2,822.00" },
];

const MOCK_BALANCES = [
  { asset: "USDC", free: "12,450.00", locked: "3,200.00", total: "15,650.00" },
  { asset: "SOL", free: "85.2", locked: "150.0", total: "235.2" },
  { asset: "ETH", free: "2.1", locked: "5.2", total: "7.3" },
];

// Simulate live PnL ticks
function useSimulatedPnL() {
  const [accountValue, setAccountValue] = useState(18920.4);
  const [unrealizedPnl, setUnrealizedPnl] = useState(163.7);
  const [todayPnl, setTodayPnl] = useState(412.3);
  const [positions, setPositions] = useState(MOCK_POSITIONS);

  useEffect(() => {
    const interval = setInterval(() => {
      const drift = () => (Math.random() - 0.48) * 15;
      setAccountValue((v) => v + drift());
      setUnrealizedPnl((v) => v + drift() * 0.4);
      setTodayPnl((v) => v + drift() * 0.3);
      setPositions((prev) =>
        prev.map((p) => ({
          ...p,
          pnl: p.pnl + (Math.random() - 0.48) * 8,
          pnlPct: p.pnlPct + (Math.random() - 0.48) * 0.1,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return { accountValue, unrealizedPnl, todayPnl, positions };
}

const StatCard = ({
  label,
  value,
  prefix,
  suffix,
  decimals,
  icon: Icon,
  trend,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: any;
  trend?: "up" | "down";
}) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="text-2xl font-bold font-mono text-foreground">
      <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
    </div>
  </div>
);

const PortfolioPage = () => {
  const { accountValue, unrealizedPnl, todayPnl, positions } = useSimulatedPnL();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
              <p className="text-sm text-muted-foreground mt-1">Your private trading dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-mono text-primary">
                <ShieldCheck className="h-3 w-3" />
                All data encrypted
              </div>
              <Link
                to="/trade"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                Trade
              </Link>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Account Value" value={accountValue} prefix="$" icon={Wallet} trend="up" />
            <StatCard label="Unrealized PnL" value={unrealizedPnl} prefix={unrealizedPnl >= 0 ? "+$" : "-$"} icon={TrendingUp} trend={unrealizedPnl >= 0 ? "up" : "down"} />
            <StatCard label="Today's PnL" value={todayPnl} prefix={todayPnl >= 0 ? "+$" : "-$"} icon={BarChart3} trend={todayPnl >= 0 ? "up" : "down"} />
            <StatCard label="Open Positions" value={positions.length} prefix="" suffix="" decimals={0} icon={Eye} />
          </div>

          {/* Tabs */}
          <div className="rounded-xl border border-border bg-card p-5">
            <Tabs defaultValue="positions">
              <TabsList className="bg-muted w-full justify-start mb-4">
                <TabsTrigger value="positions" className="flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="h-3 w-3" />
                  Open Positions
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-1.5 text-xs">
                  <History className="h-3 w-3" />
                  Trade History
                </TabsTrigger>
                <TabsTrigger value="balances" className="flex items-center gap-1.5 text-xs">
                  <Wallet className="h-3 w-3" />
                  Balances
                </TabsTrigger>
              </TabsList>

              <TabsContent value="positions">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border">
                        <th className="text-left py-2 font-medium">Market</th>
                        <th className="text-left py-2 font-medium">Side</th>
                        <th className="text-right py-2 font-medium">Size</th>
                        <th className="text-right py-2 font-medium">Entry</th>
                        <th className="text-right py-2 font-medium">Mark</th>
                        <th className="text-right py-2 font-medium">Lev.</th>
                        <th className="text-right py-2 font-medium">Liq. Price</th>
                        <th className="text-right py-2 font-medium">PnL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-3 text-foreground font-semibold">{pos.market}</td>
                          <td className={`py-3 ${pos.side === "Long" ? "text-profit" : "text-loss"}`}>
                            <span className="flex items-center gap-1">
                              {pos.side === "Long" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {pos.side}
                            </span>
                          </td>
                          <td className="py-3 text-right text-secondary-foreground">{pos.size}</td>
                          <td className="py-3 text-right text-secondary-foreground">{pos.entry}</td>
                          <td className="py-3 text-right text-secondary-foreground">{pos.mark}</td>
                          <td className="py-3 text-right text-primary">{pos.leverage}</td>
                          <td className="py-3 text-right text-warning">{pos.liqPrice}</td>
                          <td className="py-3 text-right font-semibold">
                            <AnimatedNumber
                              value={Math.abs(pos.pnl)}
                              prefix={pos.pnl >= 0 ? "+$" : "-$"}
                              className={pos.pnl >= 0 ? "text-profit" : "text-loss"}
                            />
                            <span className="text-muted-foreground ml-1">
                              {pos.pnlPct >= 0 ? "+" : ""}{pos.pnlPct.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <TradeHistory />
              </TabsContent>

              <TabsContent value="balances">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border">
                        <th className="text-left py-2 font-medium">Asset</th>
                        <th className="text-right py-2 font-medium">Free</th>
                        <th className="text-right py-2 font-medium">Locked</th>
                        <th className="text-right py-2 font-medium">Total</th>
                        <th className="text-right py-2 font-medium">Privacy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_BALANCES.map((b, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-3 text-foreground font-semibold">{b.asset}</td>
                          <td className="py-3 text-right text-secondary-foreground">{b.free}</td>
                          <td className="py-3 text-right text-secondary-foreground">{b.locked}</td>
                          <td className="py-3 text-right text-foreground font-semibold">{b.total}</td>
                          <td className="py-3 text-right"><Lock className="h-3 w-3 text-primary inline-block" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;
