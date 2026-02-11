import { ShieldCheck, Clock, History, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrderForm from "@/components/OrderForm";
import Orderbook from "@/components/Orderbook";
import { useOrders } from "@/hooks/useOrders";
import { usePriceOracle } from "@/hooks/usePriceOracle";

const TradingInterface = () => {
  const { prices } = usePriceOracle();
  const currentPrice = prices["SOL/USD"]?.price ?? 0;
  const { positions, openOrders, history, submitOrder, cancelOrder } = useOrders();

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4 max-w-5xl mx-auto">
      <div className="space-y-4">
        <Orderbook />

        <div className="rounded-xl border border-border bg-card p-4">
          <Tabs defaultValue="positions">
            <TabsList className="bg-muted w-full justify-start">
              <TabsTrigger value="positions" className="flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-3 w-3" />
                Positions {positions.length > 0 && <span className="ml-1 text-[10px] bg-primary/20 text-primary rounded-full px-1.5">{positions.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3 w-3" />
                Open Orders {openOrders.length > 0 && <span className="ml-1 text-[10px] bg-primary/20 text-primary rounded-full px-1.5">{openOrders.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1.5 text-xs">
                <History className="h-3 w-3" />
                Trade History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="positions">
              {positions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <ShieldCheck className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No open positions
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border">
                        <th className="text-left py-2 font-medium">Market</th>
                        <th className="text-left py-2 font-medium">Side</th>
                        <th className="text-right py-2 font-medium">Size</th>
                        <th className="text-right py-2 font-medium">Entry</th>
                        <th className="text-right py-2 font-medium">Leverage</th>
                        <th className="text-right py-2 font-medium">TP</th>
                        <th className="text-right py-2 font-medium">SL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((p) => (
                        <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2.5 font-mono font-medium text-foreground">{p.market}</td>
                          <td className={`py-2.5 font-semibold ${p.side === "long" ? "text-profit" : "text-loss"}`}>
                            {p.side.toUpperCase()}
                          </td>
                          <td className="py-2.5 text-right font-mono text-foreground">{p.size}</td>
                          <td className="py-2.5 text-right font-mono text-foreground">${p.entryPrice.toFixed(2)}</td>
                          <td className="py-2.5 text-right font-mono text-primary">{p.leverage}x</td>
                          <td className="py-2.5 text-right font-mono text-profit">{p.takeProfit ? `$${p.takeProfit.toFixed(2)}` : "—"}</td>
                          <td className="py-2.5 text-right font-mono text-loss">{p.stopLoss ? `$${p.stopLoss.toFixed(2)}` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              {openOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No open orders
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border">
                        <th className="text-left py-2 font-medium">Market</th>
                        <th className="text-left py-2 font-medium">Side</th>
                        <th className="text-left py-2 font-medium">Type</th>
                        <th className="text-right py-2 font-medium">Size</th>
                        <th className="text-right py-2 font-medium">Price</th>
                        <th className="text-right py-2 font-medium">Leverage</th>
                        <th className="text-right py-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {openOrders.map((o) => (
                        <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2.5 font-mono font-medium text-foreground">{o.market}</td>
                          <td className={`py-2.5 font-semibold ${o.side === "long" ? "text-profit" : "text-loss"}`}>
                            {o.side.toUpperCase()}
                          </td>
                          <td className="py-2.5 text-muted-foreground uppercase">{o.type}</td>
                          <td className="py-2.5 text-right font-mono text-foreground">{o.size}</td>
                          <td className="py-2.5 text-right font-mono text-foreground">${o.price?.toFixed(2)}</td>
                          <td className="py-2.5 text-right font-mono text-primary">{o.leverage}x</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => cancelOrder(o.id)}
                              className="text-loss hover:text-loss/80 transition-colors"
                              title="Cancel order"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No trade history yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border">
                        <th className="text-left py-2 font-medium">Market</th>
                        <th className="text-left py-2 font-medium">Side</th>
                        <th className="text-left py-2 font-medium">Type</th>
                        <th className="text-right py-2 font-medium">Size</th>
                        <th className="text-right py-2 font-medium">Price</th>
                        <th className="text-right py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((o) => (
                        <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2.5 font-mono font-medium text-foreground">{o.market}</td>
                          <td className={`py-2.5 font-semibold ${o.side === "long" ? "text-profit" : "text-loss"}`}>
                            {o.side.toUpperCase()}
                          </td>
                          <td className="py-2.5 text-muted-foreground uppercase">{o.type}</td>
                          <td className="py-2.5 text-right font-mono text-foreground">{o.size}</td>
                          <td className="py-2.5 text-right font-mono text-foreground">${o.price?.toFixed(2) ?? "Market"}</td>
                          <td className={`py-2.5 text-right font-semibold ${o.status === "filled" ? "text-profit" : "text-loss"}`}>
                            {o.status.toUpperCase()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <OrderForm onSubmit={submitOrder} currentPrice={currentPrice} market="SOL/USD" />
    </div>
  );
};

export default TradingInterface;
