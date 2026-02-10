import { Lock, ArrowUpRight, ArrowDownRight } from "lucide-react";

const MOCK_TRADES = [
  { time: "14:32:08", market: "SOL-PERP", side: "Buy", price: 148.32, size: 25.0, fee: 0.37, encrypted: true },
  { time: "14:28:45", market: "ETH-PERP", side: "Sell", price: 2351.40, size: 2.1, fee: 4.94, encrypted: true },
  { time: "14:15:22", market: "SOL-PERP", side: "Buy", price: 147.85, size: 50.0, fee: 0.74, encrypted: true },
  { time: "13:58:11", market: "BTC-PERP", side: "Sell", price: 67820.00, size: 0.15, fee: 10.17, encrypted: false },
  { time: "13:42:33", market: "SOL-PERP", side: "Buy", price: 147.10, size: 100.0, fee: 1.47, encrypted: true },
  { time: "13:30:05", market: "ARB-PERP", side: "Sell", price: 1.26, size: 5000.0, fee: 0.63, encrypted: true },
];

const TradeHistory = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 font-medium">Time</th>
            <th className="text-left py-2 font-medium">Market</th>
            <th className="text-left py-2 font-medium">Side</th>
            <th className="text-right py-2 font-medium">Price</th>
            <th className="text-right py-2 font-medium">Size</th>
            <th className="text-right py-2 font-medium">Fee</th>
            <th className="text-right py-2 font-medium">Privacy</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_TRADES.map((trade, i) => (
            <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
              <td className="py-3 text-muted-foreground">{trade.time}</td>
              <td className="py-3 text-foreground font-semibold">{trade.market}</td>
              <td className="py-3">
                <span className={`flex items-center gap-1 ${trade.side === "Buy" ? "text-profit" : "text-loss"}`}>
                  {trade.side === "Buy" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {trade.side}
                </span>
              </td>
              <td className="py-3 text-right text-secondary-foreground">${trade.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right text-secondary-foreground">{trade.encrypted ? "██.██" : trade.size.toFixed(2)}</td>
              <td className="py-3 text-right text-muted-foreground">${trade.fee.toFixed(2)}</td>
              <td className="py-3 text-right">
                {trade.encrypted ? (
                  <Lock className="h-3 w-3 text-primary inline-block" />
                ) : (
                  <span className="text-muted-foreground">Public</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeHistory;
