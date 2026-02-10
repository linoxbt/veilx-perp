import { ShieldCheck, Clock, History } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrderForm from "@/components/OrderForm";
import Orderbook from "@/components/Orderbook";

const TradingInterface = () => {
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4 max-w-5xl mx-auto">
      <div className="space-y-4">
        <Orderbook />

        <div className="rounded-xl border border-border bg-card p-4">
          <Tabs defaultValue="positions">
            <TabsList className="bg-muted w-full justify-start">
              <TabsTrigger value="positions" className="flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-3 w-3" />
                Positions
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3 w-3" />
                Open Orders
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1.5 text-xs">
                <History className="h-3 w-3" />
                Trade History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="positions">
              <div className="text-center py-8 text-muted-foreground text-sm">
                <ShieldCheck className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No open positions
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No open orders
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="text-center py-8 text-muted-foreground text-sm">
                <History className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No trade history yet
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <OrderForm />
    </div>
  );
};

export default TradingInterface;
