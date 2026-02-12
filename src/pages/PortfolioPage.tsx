import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ShieldCheck, Wallet, TrendingUp, ArrowUpRight, BarChart3, History, Eye, Clock,
  ArrowDownToLine, ArrowUpFromLine, Send, Repeat, Landmark, DollarSign,
  Percent, LineChart, Activity, PieChart, Layers,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const EmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
    <Icon className="h-7 w-7 mb-2 opacity-40" />
    <p className="text-xs">{message}</p>
  </div>
);

const StatCard = ({ label, value, icon: Icon, accent }: { label: string; value: string; icon: any; accent?: string }) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      <Icon className={`h-3.5 w-3.5 ${accent || "text-muted-foreground"}`} />
    </div>
    <div className="text-lg font-bold font-mono text-foreground">{value}</div>
  </div>
);

const PortfolioPage = () => {
  const { connected } = useWallet();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview", icon: PieChart },
    { id: "deposit", label: "Deposit", icon: ArrowDownToLine },
    { id: "withdraw", label: "Withdraw", icon: ArrowUpFromLine },
    { id: "send", label: "Send", icon: Send },
    { id: "swap", label: "Swap Stablecoins", icon: Repeat },
    { id: "staking", label: "Link Staking", icon: Landmark },
    { id: "perps", label: "Perps", icon: TrendingUp },
    { id: "spot", label: "Spot", icon: Layers },
    { id: "vaults", label: "Vaults", icon: ShieldCheck },
    { id: "fees", label: "Fees", icon: Percent },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-14 flex-1">
        <div className="max-w-[1300px] mx-auto px-4 py-6">
          {/* Page header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-foreground">Portfolio</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">Your private trading dashboard</p>
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
            <div className="flex gap-5">
              {/* Sidebar nav */}
              <nav className="hidden lg:flex flex-col gap-0.5 w-48 shrink-0">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      activeSection === s.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </button>
                ))}
              </nav>

              {/* Mobile section tabs */}
              <div className="lg:hidden mb-4 w-full">
                <select
                  value={activeSection}
                  onChange={(e) => setActiveSection(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground"
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {activeSection === "overview" && <OverviewSection />}
                {activeSection === "deposit" && <ActionSection title="Deposit" icon={ArrowDownToLine} description="Deposit USDC collateral to start trading on VeilX." />}
                {activeSection === "withdraw" && <ActionSection title="Withdraw" icon={ArrowUpFromLine} description="Withdraw available margin back to your wallet." />}
                {activeSection === "send" && <ActionSection title="Send" icon={Send} description="Transfer assets to another address." />}
                {activeSection === "swap" && <ActionSection title="Swap Stablecoins" icon={Repeat} description="Swap between USDC, USDT, and other stablecoins." />}
                {activeSection === "staking" && <ActionSection title="Link Staking" icon={Landmark} description="Stake assets and earn yield while maintaining margin." />}
                {activeSection === "perps" && <PerpsSection />}
                {activeSection === "spot" && <ActionSection title="Spot Trading" icon={Layers} description="Spot trading coming soon." />}
                {activeSection === "vaults" && <ActionSection title="Vaults" icon={ShieldCheck} description="Automated strategy vaults — coming soon." />}
                {activeSection === "fees" && <FeesSection />}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* ─── Overview ─── */
function OverviewSection() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Account Value" value="$0.00" icon={Wallet} />
        <StatCard label="Total Equity" value="$0.00" icon={PieChart} />
        <StatCard label="Perps Account Equity" value="$0.00" icon={TrendingUp} />
        <StatCard label="Spot Account Equity" value="$0.00" icon={Layers} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="PNL" value="$0.00" icon={BarChart3} accent="text-profit" />
        <StatCard label="Earn Balance" value="$0.00" icon={Landmark} />
        <StatCard label="Max Drawdown" value="—" icon={Activity} />
        <StatCard label="Open Positions" value="0" icon={Eye} />
      </div>

      {/* Detailed tabs */}
      <div className="rounded-xl border border-border bg-card p-4">
        <Tabs defaultValue="positions">
          <TabsList className="bg-muted w-full justify-start flex-wrap h-auto gap-0.5 p-1">
            <TabsTrigger value="positions" className="text-[11px] px-2.5 py-1.5">Positions</TabsTrigger>
            <TabsTrigger value="balances" className="text-[11px] px-2.5 py-1.5">Balances</TabsTrigger>
            <TabsTrigger value="open-orders" className="text-[11px] px-2.5 py-1.5">Open Orders</TabsTrigger>
            <TabsTrigger value="twap" className="text-[11px] px-2.5 py-1.5">TWAP</TabsTrigger>
            <TabsTrigger value="trade-history" className="text-[11px] px-2.5 py-1.5">Trade History</TabsTrigger>
            <TabsTrigger value="funding" className="text-[11px] px-2.5 py-1.5">Funding History</TabsTrigger>
            <TabsTrigger value="order-history" className="text-[11px] px-2.5 py-1.5">Order History</TabsTrigger>
            <TabsTrigger value="interest" className="text-[11px] px-2.5 py-1.5">Interest</TabsTrigger>
            <TabsTrigger value="deposits-withdrawals" className="text-[11px] px-2.5 py-1.5">Deposits & Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value="positions"><EmptyState icon={ShieldCheck} message="No open positions" /></TabsContent>
          <TabsContent value="balances"><EmptyState icon={Wallet} message="No balances to display" /></TabsContent>
          <TabsContent value="open-orders"><EmptyState icon={Clock} message="No open orders" /></TabsContent>
          <TabsContent value="twap"><EmptyState icon={Clock} message="No active TWAP orders" /></TabsContent>
          <TabsContent value="trade-history"><EmptyState icon={History} message="No trade history yet" /></TabsContent>
          <TabsContent value="funding"><EmptyState icon={DollarSign} message="No funding history" /></TabsContent>
          <TabsContent value="order-history"><EmptyState icon={BarChart3} message="No order history" /></TabsContent>
          <TabsContent value="interest"><EmptyState icon={Percent} message="No interest history" /></TabsContent>
          <TabsContent value="deposits-withdrawals"><EmptyState icon={ArrowDownToLine} message="No deposits or withdrawals" /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ─── Perps ─── */
function PerpsSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="PNL" value="$0.00" icon={BarChart3} accent="text-profit" />
        <StatCard label="Volume" value="$0.00" icon={LineChart} />
        <StatCard label="Max Drawdown" value="—" icon={Activity} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">14 Day Volume</h3>
        <p className="text-xs text-muted-foreground mb-4">Your rolling 14-day trading volume determines your fee tier.</p>
        <div className="h-24 rounded-lg bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
          No volume data yet
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <Tabs defaultValue="positions">
          <TabsList className="bg-muted w-full justify-start flex-wrap h-auto gap-0.5 p-1">
            <TabsTrigger value="positions" className="text-[11px] px-2.5 py-1.5">Positions</TabsTrigger>
            <TabsTrigger value="open-orders" className="text-[11px] px-2.5 py-1.5">Open Orders</TabsTrigger>
            <TabsTrigger value="twap" className="text-[11px] px-2.5 py-1.5">TWAP</TabsTrigger>
            <TabsTrigger value="trade-history" className="text-[11px] px-2.5 py-1.5">Trade History</TabsTrigger>
            <TabsTrigger value="funding" className="text-[11px] px-2.5 py-1.5">Funding History</TabsTrigger>
            <TabsTrigger value="order-history" className="text-[11px] px-2.5 py-1.5">Order History</TabsTrigger>
          </TabsList>
          <TabsContent value="positions"><EmptyState icon={ShieldCheck} message="No perp positions" /></TabsContent>
          <TabsContent value="open-orders"><EmptyState icon={Clock} message="No open orders" /></TabsContent>
          <TabsContent value="twap"><EmptyState icon={Clock} message="No TWAP orders" /></TabsContent>
          <TabsContent value="trade-history"><EmptyState icon={History} message="No trade history" /></TabsContent>
          <TabsContent value="funding"><EmptyState icon={DollarSign} message="No funding history" /></TabsContent>
          <TabsContent value="order-history"><EmptyState icon={BarChart3} message="No order history" /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ─── Fees ─── */
function FeesSection() {
  const tiers = [
    { volume: "$0 – $1M", taker: "0.050%", maker: "0.020%" },
    { volume: "$1M – $5M", taker: "0.040%", maker: "0.015%" },
    { volume: "$5M – $25M", taker: "0.035%", maker: "0.010%" },
    { volume: "$25M – $100M", taker: "0.030%", maker: "0.005%" },
    { volume: "$100M+", taker: "0.025%", maker: "0.000%" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Taker Fee" value="0.050%" icon={Percent} />
        <StatCard label="Maker Fee" value="0.020%" icon={Percent} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Fee Schedule</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-2 font-medium">14d Volume</th>
              <th className="text-right py-2 font-medium">Taker</th>
              <th className="text-right py-2 font-medium">Maker</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t, i) => (
              <tr key={i} className={`border-b border-border/50 ${i === 0 ? "bg-primary/5" : ""}`}>
                <td className="py-2 font-mono text-foreground">{t.volume}</td>
                <td className="py-2 text-right font-mono text-foreground">{t.taker}</td>
                <td className="py-2 text-right font-mono text-foreground">{t.maker}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Generic action section ─── */
function ActionSection({ title, icon: Icon, description }: { title: string; icon: any; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center py-16 gap-4">
      <Icon className="h-10 w-10 text-muted-foreground" />
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground text-center max-w-md">{description}</p>
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-xs text-primary font-medium">
        Coming Soon
      </div>
    </div>
  );
}

export default PortfolioPage;
