import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ShieldCheck,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  History,
  Lock,
  Eye,
  Clock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const PortfolioPage = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-foreground">Portfolio</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Your private trading dashboard</p>
            </div>
            <Link
              to="/trade"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              Trade
            </Link>
          </div>

          {!connected ? (
            <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-20 gap-4">
              <Wallet className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Connect your wallet to view your portfolio</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Account Value", value: "—", icon: Wallet },
                  { label: "Unrealized PnL", value: "—", icon: TrendingUp },
                  { label: "Today's PnL", value: "—", icon: BarChart3 },
                  { label: "Open Positions", value: "0", icon: Eye },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium text-muted-foreground">{stat.label}</span>
                      <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="text-lg font-bold font-mono text-foreground">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="rounded-xl border border-border bg-card p-4">
                <Tabs defaultValue="positions">
                  <TabsList className="bg-muted w-full justify-start mb-4">
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
                    <TabsTrigger value="balances" className="flex items-center gap-1.5 text-xs">
                      <Wallet className="h-3 w-3" />
                      Balances
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="positions">
                    <EmptyState icon={ShieldCheck} message="No open positions" />
                  </TabsContent>

                  <TabsContent value="orders">
                    <EmptyState icon={Clock} message="No open orders" />
                  </TabsContent>

                  <TabsContent value="history">
                    <EmptyState icon={History} message="No trade history yet" />
                  </TabsContent>

                  <TabsContent value="balances">
                    <EmptyState icon={Wallet} message="No balances to display" />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const EmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
    <Icon className="h-8 w-8 mb-2 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);

export default PortfolioPage;
