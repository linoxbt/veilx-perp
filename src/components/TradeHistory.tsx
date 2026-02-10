import { History } from "lucide-react";

const TradeHistory = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <History className="h-8 w-8 mb-2 opacity-40" />
      <p className="text-sm">No trade history yet</p>
    </div>
  );
};

export default TradeHistory;
