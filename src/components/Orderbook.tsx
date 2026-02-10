import { Lock } from "lucide-react";

const MOCK_ORDERBOOK = {
  asks: [
    { price: 2348.50, size: 12.4, encrypted: true },
    { price: 2347.80, size: 8.2, encrypted: true },
    { price: 2347.20, size: 25.1, encrypted: false },
    { price: 2346.90, size: 5.7, encrypted: true },
    { price: 2346.40, size: 18.3, encrypted: true },
  ],
  bids: [
    { price: 2345.60, size: 15.8, encrypted: true },
    { price: 2345.10, size: 22.4, encrypted: true },
    { price: 2344.50, size: 9.1, encrypted: false },
    { price: 2343.80, size: 31.2, encrypted: true },
    { price: 2343.20, size: 7.6, encrypted: true },
  ],
};

const Orderbook = () => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-foreground">Orderbook — SOL-PERP</h3>
      <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
        <Lock className="h-3 w-3" />
        MPC Encrypted
      </div>
    </div>

    <div className="grid grid-cols-3 text-xs font-mono text-muted-foreground mb-2 px-2">
      <span>Price</span>
      <span className="text-right">Size</span>
      <span className="text-right">Status</span>
    </div>

    {/* Asks */}
    <div className="space-y-0.5 mb-2">
      {MOCK_ORDERBOOK.asks.map((ask, i) => (
        <div key={i} className="grid grid-cols-3 text-xs font-mono px-2 py-1 rounded hover:bg-secondary/50 transition-colors">
          <span className="text-loss">${ask.price.toFixed(2)}</span>
          <span className="text-right text-secondary-foreground">
            {ask.encrypted ? "██.██" : ask.size.toFixed(1)}
          </span>
          <span className="text-right">
            {ask.encrypted ? (
              <Lock className="h-3 w-3 text-primary inline-block" />
            ) : (
              <span className="text-muted-foreground">Public</span>
            )}
          </span>
        </div>
      ))}
    </div>

    {/* Spread */}
    <div className="text-center py-2 border-y border-border text-sm font-mono font-bold text-foreground">
      $2,346.00 <span className="text-muted-foreground text-xs ml-2">Spread: $0.80</span>
    </div>

    {/* Bids */}
    <div className="space-y-0.5 mt-2">
      {MOCK_ORDERBOOK.bids.map((bid, i) => (
        <div key={i} className="grid grid-cols-3 text-xs font-mono px-2 py-1 rounded hover:bg-secondary/50 transition-colors">
          <span className="text-profit">${bid.price.toFixed(2)}</span>
          <span className="text-right text-secondary-foreground">
            {bid.encrypted ? "██.██" : bid.size.toFixed(1)}
          </span>
          <span className="text-right">
            {bid.encrypted ? (
              <Lock className="h-3 w-3 text-primary inline-block" />
            ) : (
              <span className="text-muted-foreground">Public</span>
            )}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default Orderbook;
