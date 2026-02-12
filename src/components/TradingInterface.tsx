import { useState } from "react";
import {
  ShieldCheck, Clock, History, X, Loader2, ExternalLink,
  Wallet, BarChart3, DollarSign, Timer,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrderForm from "@/components/OrderForm";
import Orderbook from "@/components/Orderbook";
import { useOrders } from "@/hooks/useOrders";
import { usePriceOracle } from "@/hooks/usePriceOracle";
import { toast } from "sonner";

const EmptyTab = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
    <Icon className="h-7 w-7 mb-2 opacity-40" />
    <p className="text-xs">{message}</p>
  </div>
);

const TradingInterface = () => {
  const { prices } = usePriceOracle();
  const currentPrice = prices["SOL/USD"]?.price ?? 0;
  const { positions, openOrders, history, submitOrder, cancelOrder, closePosition } = useOrders();
  const [closingId, setClosingId] = useState<string | null>(null);

  const handleClosePosition = async (id: string) => {
    if (!currentPrice) {
      toast.error("Price unavailable — try again");
      return;
    }
    setClosingId(id);
    try {
      const pnl = await closePosition(id, currentPrice);
      if (pnl !== undefined) {
        toast.success(`Position closed — PnL: ${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}`, {
          description: "Transaction confirmed on Solana",
        });
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to close position");
    } finally {
      setClosingId(null);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4 max-w-5xl mx-auto">
      <div className="space-y-4">
        <Orderbook />

        <div className="rounded-xl border border-border bg-card p-4">
          <Tabs defaultValue="positions">
            <TabsList className="bg-muted w-full justify-start flex-wrap h-auto gap-0.5 p-1">
              <TabsTrigger value="positions" className="flex items-center gap-1 text-[11px] px-2.5 py-1.5">
                <ShieldCheck className="h-3 w-3" />
                Positions {positions.length > 0 && <span className="ml-0.5 text-[9px] bg-primary/20 text-primary rounded-full px-1.5">{positions.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1 text-[11px] px-2.5 py-1.5">
                <Clock className="h-3 w-3" />
                Open Orders {openOrders.length > 0 && <span className="ml-0.5 text-[9px] bg-primary/20 text-primary rounded-full px-1.5">{openOrders.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="twap" className="flex items-center gap-1 text-[11px] px-2.5 py-1.5">
                <Timer className="h-3 w-3" />
                TWAP
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1 text-[11px] px-2.5 py-1.5">
                <History className="h-3 w-3" />
                Trade History
              </TabsTrigger>
              <TabsTrigger value="funding" className="flex items-center gap-1 text-[11px] px-2.5 py-1.5">
                <DollarSign className="h-3 w-3" />
                Funding
              </TabsTrigger>
              <TabsTrigger value="order-history" className="flex items-center gap-1 text-[11px] px-2.5 py-1.5">
                <BarChart3 className="h-3 w-3" />
                Order History
              </TabsTrigger>
              <TabsTrigger value="balances" className="flex items-center gap-1 text-[11px] px-2.5 py-1.5">
                <Wallet className="h-3 w-3" />
                Balances
              </TabsTrigger>
            </TabsList>

            {/* Positions */}
            <TabsContent value="positions">
              <PositionsTable
                positions={positions}
                currentPrice={currentPrice}
                closingId={closingId}
                onClose={handleClosePosition}
              />
            </TabsContent>

            {/* Open Orders */}
            <TabsContent value="orders">
              <OpenOrdersTable orders={openOrders} onCancel={cancelOrder} />
            </TabsContent>

            {/* TWAP */}
            <TabsContent value="twap">
              <EmptyTab icon={Timer} message="No active TWAP orders" />
            </TabsContent>

            {/* Trade History */}
            <TabsContent value="history">
              <TradeHistoryTable history={history} />
            </TabsContent>

            {/* Funding History */}
            <TabsContent value="funding">
              <EmptyTab icon={DollarSign} message="No funding history" />
            </TabsContent>

            {/* Order History */}
            <TabsContent value="order-history">
              <OrderHistoryTable history={history} />
            </TabsContent>

            {/* Balances */}
            <TabsContent value="balances">
              <EmptyTab icon={Wallet} message="No balances — deposit to start trading" />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <OrderForm onSubmit={submitOrder} currentPrice={currentPrice} market="SOL/USD" />
    </div>
  );
};

/* Sub-components */

interface Position {
  id: string;
  market: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  leverage: number;
  takeProfit: number | null;
  stopLoss: number | null;
  txSignature?: string;
}

function PositionsTable({
  positions,
  currentPrice,
  closingId,
  onClose,
}: {
  positions: Position[];
  currentPrice: number;
  closingId: string | null;
  onClose: (id: string) => void;
}) {
  if (!positions.length) return <EmptyTab icon={ShieldCheck} message="No open positions" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Market</th>
            <th className="text-left py-2 font-medium">Side</th>
            <th className="text-right py-2 font-medium">Size</th>
            <th className="text-right py-2 font-medium">Entry</th>
            <th className="text-right py-2 font-medium">Lev.</th>
            <th className="text-right py-2 font-medium">TP</th>
            <th className="text-right py-2 font-medium">SL</th>
            <th className="text-right py-2 font-medium">uPnL</th>
            <th className="text-right py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => {
            const diff = currentPrice - p.entryPrice;
            const upnl = Math.round((p.side === "long" ? diff : -diff) * p.size * p.leverage * 100) / 100;
            return (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-2 font-mono font-medium text-foreground">
                  <div className="flex items-center gap-1">
                    {p.market}
                    {p.txSignature && !p.txSignature.startsWith("local_") && (
                      <a
                        href={`https://explorer.solana.com/tx/${p.txSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </td>
                <td className={`py-2 font-semibold ${p.side === "long" ? "text-profit" : "text-loss"}`}>{p.side.toUpperCase()}</td>
                <td className="py-2 text-right font-mono text-foreground">{p.size}</td>
                <td className="py-2 text-right font-mono text-foreground">${p.entryPrice.toFixed(2)}</td>
                <td className="py-2 text-right font-mono text-primary">{p.leverage}x</td>
                <td className="py-2 text-right font-mono text-profit">{p.takeProfit ? `$${p.takeProfit.toFixed(2)}` : "—"}</td>
                <td className="py-2 text-right font-mono text-loss">{p.stopLoss ? `$${p.stopLoss.toFixed(2)}` : "—"}</td>
                <td className={`py-2 text-right font-mono font-semibold ${upnl >= 0 ? "text-profit" : "text-loss"}`}>
                  {upnl >= 0 ? "+" : ""}${upnl.toFixed(2)}
                </td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => onClose(p.id)}
                    disabled={closingId === p.id}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-loss/10 text-loss hover:bg-loss/20 transition-colors disabled:opacity-50"
                  >
                    {closingId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Close"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function OpenOrdersTable({ orders, onCancel }: { orders: any[]; onCancel: (id: string) => void }) {
  if (!orders.length) return <EmptyTab icon={Clock} message="No open orders" />;
  return (
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
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="py-2 font-mono font-medium text-foreground">{o.market}</td>
              <td className={`py-2 font-semibold ${o.side === "long" ? "text-profit" : "text-loss"}`}>{o.side.toUpperCase()}</td>
              <td className="py-2 text-muted-foreground uppercase">{o.type}</td>
              <td className="py-2 text-right font-mono text-foreground">{o.size}</td>
              <td className="py-2 text-right font-mono text-foreground">${o.price?.toFixed(2)}</td>
              <td className="py-2 text-right font-mono text-primary">{o.leverage}x</td>
              <td className="py-2 text-right">
                <button onClick={() => onCancel(o.id)} className="text-loss hover:text-loss/80 transition-colors" title="Cancel order">
                  <X className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TradeHistoryTable({ history }: { history: any[] }) {
  if (!history.length) return <EmptyTab icon={History} message="No trade history yet" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Market</th>
            <th className="text-left py-2 font-medium">Side</th>
            <th className="text-right py-2 font-medium">Size</th>
            <th className="text-right py-2 font-medium">Price</th>
            <th className="text-right py-2 font-medium">PnL</th>
            <th className="text-right py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((o) => (
            <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="py-2 font-mono font-medium text-foreground">{o.market}</td>
              <td className={`py-2 font-semibold ${o.side === "long" ? "text-profit" : "text-loss"}`}>{o.side.toUpperCase()}</td>
              <td className="py-2 text-right font-mono text-foreground">{o.size}</td>
              <td className="py-2 text-right font-mono text-foreground">${o.price?.toFixed(2) ?? "Market"}</td>
              <td className={`py-2 text-right font-mono font-semibold ${o.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                {o.status === "closed" ? `${o.pnl >= 0 ? "+" : ""}$${o.pnl.toFixed(2)}` : "—"}
              </td>
              <td className={`py-2 text-right font-semibold ${o.status === "closed" ? "text-foreground" : "text-loss"}`}>
                {o.status.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderHistoryTable({ history }: { history: any[] }) {
  if (!history.length) return <EmptyTab icon={BarChart3} message="No order history" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Time</th>
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
              <td className="py-2 font-mono text-muted-foreground">{new Date(o.timestamp).toLocaleTimeString()}</td>
              <td className="py-2 font-mono font-medium text-foreground">{o.market}</td>
              <td className={`py-2 font-semibold ${o.side === "long" ? "text-profit" : "text-loss"}`}>{o.side.toUpperCase()}</td>
              <td className="py-2 text-muted-foreground uppercase">{o.type}</td>
              <td className="py-2 text-right font-mono text-foreground">{o.size}</td>
              <td className="py-2 text-right font-mono text-foreground">${o.price?.toFixed(2) ?? "Market"}</td>
              <td className={`py-2 text-right font-semibold ${o.status === "closed" ? "text-foreground" : o.status === "cancelled" ? "text-loss" : "text-muted-foreground"}`}>
                {o.status.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TradingInterface;
