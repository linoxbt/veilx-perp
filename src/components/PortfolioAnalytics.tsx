import { useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Target, Clock, BarChart3 } from "lucide-react";

interface Trade {
  pnl: number | null;
  created_at: string;
  closed_at: string | null;
  status: string;
}

interface Props {
  trades: Trade[];
}

const PortfolioAnalytics = ({ trades }: Props) => {
  const closedTrades = useMemo(() => trades.filter((t) => t.status === "closed"), [trades]);

  const stats = useMemo(() => {
    if (!closedTrades.length) return null;
    const wins = closedTrades.filter((t) => (t.pnl ?? 0) > 0).length;
    const totalPnl = closedTrades.reduce((s, t) => s + (t.pnl ?? 0), 0);
    const avgPnl = totalPnl / closedTrades.length;
    const avgHoldMs = closedTrades
      .filter((t) => t.closed_at)
      .map((t) => new Date(t.closed_at!).getTime() - new Date(t.created_at).getTime());
    const avgHold = avgHoldMs.length ? avgHoldMs.reduce((a, b) => a + b, 0) / avgHoldMs.length : 0;
    return { wins, total: closedTrades.length, winRate: (wins / closedTrades.length) * 100, totalPnl, avgPnl, avgHoldMin: avgHold / 60000 };
  }, [closedTrades]);

  const cumulativeData = useMemo(() => {
    let cumPnl = 0;
    return closedTrades
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((t, i) => {
        cumPnl += t.pnl ?? 0;
        return { trade: i + 1, pnl: Math.round(cumPnl * 100) / 100 };
      });
  }, [closedTrades]);

  const distribution = useMemo(() => {
    return closedTrades.map((t, i) => ({
      trade: i + 1,
      pnl: Math.round((t.pnl ?? 0) * 100) / 100,
    }));
  }, [closedTrades]);

  if (!stats || closedTrades.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-3 opacity-40" />
        <p className="text-sm text-muted-foreground">Close some trades to see analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini icon={TrendingUp} label="Total PnL" value={`${stats.totalPnl >= 0 ? "+" : ""}$${stats.totalPnl.toFixed(2)}`} accent={stats.totalPnl >= 0 ? "text-profit" : "text-loss"} />
        <StatMini icon={Target} label="Win Rate" value={`${stats.winRate.toFixed(0)}%`} accent="text-primary" />
        <StatMini icon={BarChart3} label="Avg PnL" value={`$${stats.avgPnl.toFixed(2)}`} accent={stats.avgPnl >= 0 ? "text-profit" : "text-loss"} />
        <StatMini icon={Clock} label="Avg Hold" value={stats.avgHoldMin < 1 ? "<1m" : `${stats.avgHoldMin.toFixed(0)}m`} accent="text-muted-foreground" />
      </div>

      {/* Cumulative PnL */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Cumulative PnL</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="trade" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="pnl" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#cumGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PnL Distribution */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">PnL Distribution</h3>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="trade" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="pnl" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

function StatMini({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1 mb-1">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <span className={`text-sm font-bold font-mono ${accent}`}>{value}</span>
    </div>
  );
}

export default PortfolioAnalytics;
