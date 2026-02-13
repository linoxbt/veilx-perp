import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, Activity, DollarSign, Eye, EyeOff, Lock, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SimulatedPosition {
  id: string;
  market: string;
  healthPercent: number;
  encrypted: boolean;
  side: "long" | "short";
  status: "healthy" | "warning" | "danger" | "liquidated";
}

const SIMULATED_POSITIONS: SimulatedPosition[] = [
  { id: "pos_1", market: "SOL/USD", healthPercent: 82, encrypted: true, side: "long", status: "healthy" },
  { id: "pos_2", market: "ETH/USD", healthPercent: 45, encrypted: true, side: "short", status: "warning" },
  { id: "pos_3", market: "BTC/USD", healthPercent: 18, encrypted: true, side: "long", status: "danger" },
  { id: "pos_4", market: "ARB/USD", healthPercent: 91, encrypted: true, side: "short", status: "healthy" },
];

const RECENT_LIQUIDATIONS = [
  { id: "liq_1", market: "ETH/USD", time: "2m ago", deficit: "█████", fee: "██.█", type: "MPC Verified" },
  { id: "liq_2", market: "BTC/USD", time: "14m ago", deficit: "████████", fee: "███.█", type: "MPC Verified" },
  { id: "liq_3", market: "SOL/USD", time: "1h ago", deficit: "██████", fee: "██.█", type: "MPC Verified" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy": return "text-profit";
    case "warning": return "text-warning";
    case "danger": return "text-loss";
    case "liquidated": return "text-muted-foreground";
    default: return "text-muted-foreground";
  }
};

const getProgressColor = (health: number) => {
  if (health > 60) return "bg-profit";
  if (health > 30) return "bg-[hsl(var(--warning))]";
  return "bg-loss";
};

const StatCard = ({ label, value, icon: Icon, accent }: { label: string; value: string; icon: any; accent?: string }) => (
  <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      <Icon className={`h-3.5 w-3.5 ${accent || "text-muted-foreground"}`} />
    </div>
    <div className="text-base sm:text-lg font-bold font-mono text-foreground">{value}</div>
  </div>
);

const LiquidationDashboard = () => {
  const [revealOwn, setRevealOwn] = useState(false);
  const [positions, setPositions] = useState(SIMULATED_POSITIONS);

  // Simulate health fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(p => {
        const delta = (Math.random() - 0.5) * 4;
        const newHealth = Math.max(0, Math.min(100, p.healthPercent + delta));
        const status = newHealth > 60 ? "healthy" : newHealth > 25 ? "warning" : newHealth > 0 ? "danger" : "liquidated";
        return { ...p, healthPercent: Math.round(newHealth), status };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5">
      {/* MPC Shield Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Arcium MPC Liquidation Engine</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          All liquidation checks run inside the Arcium 3-of-5 MPC network. Margin health, leverage, and liquidation thresholds are <strong className="text-foreground">never exposed on-chain</strong>. Only a verified boolean (liquidatable or not) is returned to the settlement layer.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Liquidations" value="847" icon={TrendingDown} accent="text-loss" />
        <StatCard label="Insurance Fund" value="$1.24M" icon={DollarSign} accent="text-profit" />
        <StatCard label="Liquidation Fee" value="2.5%" icon={Activity} />
        <StatCard label="Active Monitors" value="3/5 MPC" icon={ShieldCheck} accent="text-primary" />
      </div>

      {/* Position Health Monitor */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Position Health Monitor</h3>
          <button
            onClick={() => setRevealOwn(!revealOwn)}
            className="flex items-center gap-1.5 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {revealOwn ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {revealOwn ? "Showing your data" : "Encrypted view"}
          </button>
        </div>

        <div className="space-y-3">
          {positions.map((pos) => (
            <div key={pos.id} className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{pos.market}</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                    {pos.side.toUpperCase()}
                  </Badge>
                  <Badge variant={pos.status === "healthy" ? "default" : pos.status === "warning" ? "secondary" : "destructive"} className="text-[9px] px-1.5 py-0">
                    {pos.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  {pos.encrypted && !revealOwn && <Lock className="h-3 w-3 text-muted-foreground" />}
                  <span className={`text-xs font-mono font-bold ${getStatusColor(pos.status)}`}>
                    {revealOwn ? `${pos.healthPercent}%` : "██.█%"}
                  </span>
                </div>
              </div>

              {/* Health bar */}
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getProgressColor(pos.healthPercent)}`}
                  style={{ width: revealOwn ? `${pos.healthPercent}%` : "50%", opacity: revealOwn ? 1 : 0.3 }}
                />
              </div>

              {/* Encrypted details */}
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                <span>Margin: {revealOwn ? `$${(Math.random() * 10000).toFixed(2)}` : "████████"}</span>
                <span>Liq Price: {revealOwn ? `$${(Math.random() * 200).toFixed(2)}` : "██████"}</span>
                <span>Leverage: {revealOwn ? `${Math.ceil(Math.random() * 50)}x` : "██x"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liquidation Queue */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-loss" />
          <h3 className="text-sm font-semibold text-foreground">Approaching Liquidation</h3>
        </div>
        {positions.filter(p => p.status === "danger" || p.status === "warning").length > 0 ? (
          <div className="space-y-2">
            {positions.filter(p => p.status === "danger" || p.status === "warning").map(pos => (
              <div key={pos.id} className="flex items-center justify-between rounded-lg border border-loss/20 bg-loss/5 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${pos.status === "danger" ? "bg-loss animate-pulse" : "bg-[hsl(var(--warning))]"}`} />
                  <span className="text-xs font-semibold text-foreground">{pos.market}</span>
                  <span className="text-[10px] text-muted-foreground">{pos.side}</span>
                </div>
                <span className={`text-xs font-mono font-bold ${getStatusColor(pos.status)}`}>
                  Health: {revealOwn ? `${pos.healthPercent}%` : "██%"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">No positions near liquidation threshold</p>
        )}
      </div>

      {/* Recent Liquidation Events */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Liquidation Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-2 font-medium">Market</th>
                <th className="text-left py-2 font-medium">Time</th>
                <th className="text-right py-2 font-medium">Deficit</th>
                <th className="text-right py-2 font-medium">Fee</th>
                <th className="text-right py-2 font-medium">Verification</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_LIQUIDATIONS.map((liq) => (
                <tr key={liq.id} className="border-b border-border/50">
                  <td className="py-2 font-semibold text-foreground">{liq.market}</td>
                  <td className="py-2 text-muted-foreground">{liq.time}</td>
                  <td className="py-2 text-right font-mono text-muted-foreground">{liq.deficit}</td>
                  <td className="py-2 text-right font-mono text-muted-foreground">{liq.fee}</td>
                  <td className="py-2 text-right">
                    <Badge className="text-[9px] bg-primary/10 text-primary border-primary/20">{liq.type}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">
          Deficit and fee amounts are encrypted — only the liquidated trader and the protocol can decrypt. Third parties see redacted values.
        </p>
      </div>
    </div>
  );
};

export default LiquidationDashboard;
