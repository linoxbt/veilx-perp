import { useState } from "react";
import { Lock, TrendingUp, TrendingDown, ShieldCheck, Clock, History } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TradeHistory from "@/components/TradeHistory";
import OrderForm from "@/components/OrderForm";
import Orderbook from "@/components/Orderbook";

const MOCK_POSITIONS = [
  { market: "SOL-PERP", side: "Long", size: "150.0", entry: "$148.32", pnl: "+$245.80", pnlPct: "+1.1%", encrypted: true },
  { market: "ETH-PERP", side: "Short", size: "5.2", entry: "$2,351.40", pnl: "-$82.10", pnlPct: "-0.7%", encrypted: true },
];

const TradingInterface = () => {
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4 max-w-5xl mx-auto">
      {/* Main area: orderbook + tabs */}
      <div className="space-y-4">
        <Orderbook />

        {/* Positions & Trade History Tabs */}
        <div className="rounded-xl border border-border bg-card p-4">
          <Tabs defaultValue="positions">
            <TabsList className="bg-muted w-full justify-start">
              <TabsTrigger value="positions" className="flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-3 w-3" />
                Positions
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1.5 text-xs">
                <History className="h-3 w-3" />
                Trade History
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3 w-3" />
                Open Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="positions">
              <div className="flex items-center justify-between mb-3 mt-2">
                <h3 className="text-sm font-semibold text-foreground">Your Positions</h3>
                <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
                  <ShieldCheck className="h-3 w-3" />
                  Only You Can See
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-muted-foreground border-b border-border">
                      <th className="text-left py-2 font-medium">Market</th>
                      <th className="text-left py-2 font-medium">Side</th>
                      <th className="text-right py-2 font-medium">Size</th>
                      <th className="text-right py-2 font-medium">Entry</th>
                      <th className="text-right py-2 font-medium">PnL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_POSITIONS.map((pos, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 text-foreground font-semibold">{pos.market}</td>
                        <td className={`py-3 ${pos.side === "Long" ? "text-profit" : "text-loss"}`}>{pos.side}</td>
                        <td className="py-3 text-right text-secondary-foreground">{pos.size}</td>
                        <td className="py-3 text-right text-secondary-foreground">{pos.entry}</td>
                        <td className={`py-3 text-right font-semibold ${pos.pnl.startsWith("+") ? "text-profit" : "text-loss"}`}>
                          {pos.pnl} <span className="text-muted-foreground">{pos.pnlPct}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="mt-2">
                <TradeHistory />
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="mt-2 text-center py-8 text-muted-foreground text-sm">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No open orders
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Order form */}
      <OrderForm />
    </div>
  );
};

export default TradingInterface;
