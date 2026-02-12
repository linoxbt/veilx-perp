import { useState, useEffect, useMemo } from "react";
import { Lock } from "lucide-react";
import { usePriceOracle } from "@/hooks/usePriceOracle";

interface OrderLevel {
  price: number;
  size: number;
  total: number;
  encrypted: boolean;
}

function generateOrderbook(midPrice: number): { asks: OrderLevel[]; bids: OrderLevel[] } {
  const spread = midPrice * 0.0003;
  const asks: OrderLevel[] = [];
  const bids: OrderLevel[] = [];

  let askTotal = 0;
  for (let i = 0; i < 10; i++) {
    const price = midPrice + spread / 2 + i * midPrice * 0.0001 + Math.random() * midPrice * 0.00005;
    const size = Math.round((Math.random() * 40 + 2) * 100) / 100;
    askTotal += size;
    asks.push({ price, size, total: askTotal, encrypted: Math.random() > 0.3 });
  }

  let bidTotal = 0;
  for (let i = 0; i < 10; i++) {
    const price = midPrice - spread / 2 - i * midPrice * 0.0001 - Math.random() * midPrice * 0.00005;
    const size = Math.round((Math.random() * 40 + 2) * 100) / 100;
    bidTotal += size;
    bids.push({ price, size, total: bidTotal, encrypted: Math.random() > 0.3 });
  }

  return { asks: asks.reverse(), bids };
}

const Orderbook = () => {
  const { prices } = usePriceOracle();
  const currentPrice = prices["SOL/USD"]?.price ?? 180;
  const [book, setBook] = useState(() => generateOrderbook(currentPrice));

  useEffect(() => {
    const interval = setInterval(() => {
      setBook(generateOrderbook(currentPrice));
    }, 2000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  const maxTotal = useMemo(() => {
    const maxAsk = book.asks.length ? book.asks[book.asks.length - 1].total : 0;
    const maxBid = book.bids.length ? book.bids[book.bids.length - 1].total : 0;
    return Math.max(maxAsk, maxBid);
  }, [book]);

  const spread = book.bids.length && book.asks.length
    ? book.asks[book.asks.length - 1].price - book.bids[0].price
    : 0;
  const spreadPct = currentPrice ? ((spread / currentPrice) * 100).toFixed(3) : "0";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Orderbook</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono">
          <Lock className="h-3 w-3" />
          MPC Encrypted
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 text-[10px] font-mono text-muted-foreground mb-1 px-1">
        <span>Price (USDC)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks */}
      <div className="space-y-px">
        {book.asks.map((ask, i) => (
          <div key={i} className="relative grid grid-cols-3 text-[11px] font-mono px-1 py-0.5 hover:bg-muted/40 transition-colors">
            <div
              className="absolute inset-0 bg-loss/8 pointer-events-none"
              style={{ width: `${(ask.total / maxTotal) * 100}%`, right: 0, left: "auto" }}
            />
            <span className="text-loss relative z-10">{ask.price.toFixed(2)}</span>
            <span className="text-right text-foreground/80 relative z-10">
              {ask.encrypted ? "██.██" : ask.size.toFixed(2)}
            </span>
            <span className="text-right text-muted-foreground relative z-10">{ask.total.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Mid price / Spread */}
      <div className="flex items-center justify-between py-1.5 px-1 border-y border-border my-1">
        <span className="text-sm font-mono font-bold text-foreground">
          ${currentPrice.toFixed(2)}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          Spread: ${spread.toFixed(2)} ({spreadPct}%)
        </span>
      </div>

      {/* Bids */}
      <div className="space-y-px">
        {book.bids.map((bid, i) => (
          <div key={i} className="relative grid grid-cols-3 text-[11px] font-mono px-1 py-0.5 hover:bg-muted/40 transition-colors">
            <div
              className="absolute inset-0 bg-profit/8 pointer-events-none"
              style={{ width: `${(bid.total / maxTotal) * 100}%`, right: 0, left: "auto" }}
            />
            <span className="text-profit relative z-10">{bid.price.toFixed(2)}</span>
            <span className="text-right text-foreground/80 relative z-10">
              {bid.encrypted ? "██.██" : bid.size.toFixed(2)}
            </span>
            <span className="text-right text-muted-foreground relative z-10">{bid.total.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orderbook;
