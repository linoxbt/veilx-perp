import { useEffect, useState } from "react";
import { Trophy, TrendingUp, BarChart3, Medal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  wallet_address: string | null;
  total_pnl: number | null;
  total_trades: number | null;
  winning_trades: number | null;
  avg_pnl: number | null;
  last_trade_at: string | null;
}

const LeaderboardPage = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("leaderboard")
        .select("*")
        .order("total_pnl", { ascending: false })
        .limit(50);
      setEntries(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const maskWallet = (w: string | null) =>
    w ? `${w.slice(0, 4)}…${w.slice(-4)}` : "—";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-14 flex-1">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-xs text-muted-foreground">Top traders by realized PnL</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-muted-foreground text-sm">Loading…</div>
            ) : entries.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">No trades yet — be the first!</div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-muted-foreground border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-medium">#</th>
                    <th className="text-left py-3 px-4 font-medium">Wallet</th>
                    <th className="text-right py-3 px-4 font-medium">Total PnL</th>
                    <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">Win Rate</th>
                    <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">Trades</th>
                    <th className="text-right py-3 px-4 font-medium hidden md:table-cell">Avg PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => {
                    const winRate =
                      e.total_trades && e.winning_trades
                        ? ((e.winning_trades / e.total_trades) * 100).toFixed(0)
                        : "0";
                    const pnl = e.total_pnl ?? 0;
                    return (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-mono">
                          {i < 3 ? (
                            <Medal className={`h-4 w-4 ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : "text-amber-600"}`} />
                          ) : (
                            <span className="text-muted-foreground">{i + 1}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-foreground">{maskWallet(e.wallet_address)}</td>
                        <td className={`py-3 px-4 text-right font-mono font-semibold ${pnl >= 0 ? "text-profit" : "text-loss"}`}>
                          {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-foreground hidden sm:table-cell">{winRate}%</td>
                        <td className="py-3 px-4 text-right font-mono text-muted-foreground hidden sm:table-cell">{e.total_trades ?? 0}</td>
                        <td className="py-3 px-4 text-right font-mono text-muted-foreground hidden md:table-cell">
                          ${(e.avg_pnl ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
