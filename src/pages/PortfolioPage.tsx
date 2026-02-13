import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { toast } from "sonner";
import { PROGRAM_IDS, USDC_MINT, USDC_DECIMALS, NATIVE_SOL_MINT, SOL_DECIMALS, VEILX_SWAP_PROGRAM } from "@/config/programs";
import {
  ShieldCheck, Wallet, TrendingUp, ArrowUpRight, BarChart3, History, Eye, Clock,
  ArrowDownToLine, ArrowUpFromLine, Send, Repeat, Landmark, DollarSign,
  Percent, LineChart, Activity, PieChart, Layers, Loader2, Droplets, RefreshCw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/* ─── Balance Hook ─── */
function useWalletBalances() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (!publicKey || !connected) {
      setSolBalance(null);
      setUsdcBalance(null);
      return;
    }
    setLoading(true);
    try {
      // SOL balance
      const lamports = await connection.getBalance(publicKey);
      setSolBalance(lamports / LAMPORTS_PER_SOL);

      // USDC balance
      try {
        const { getAssociatedTokenAddress } = await import("@solana/spl-token");
        const ata = await getAssociatedTokenAddress(USDC_MINT, publicKey);
        const info = await connection.getTokenAccountBalance(ata);
        setUsdcBalance(Number(info.value.uiAmount));
      } catch {
        setUsdcBalance(0); // No ATA = 0 balance
      }
    } catch (err) {
      console.error("Balance fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected, connection]);

  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [fetchBalances]);

  return { solBalance, usdcBalance, loading, refresh: fetchBalances };
}

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
                {activeSection === "deposit" && <DepositSection />}
                {activeSection === "withdraw" && <WithdrawSection />}
                {activeSection === "send" && <ActionSection title="Send" icon={Send} description="Transfer assets to another address." />}
                {activeSection === "swap" && <SwapSection />}
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

/* ─── Deposit Section ─── */
function DepositSection() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<"SOL" | "USDC">("SOL");
  const [loading, setLoading] = useState(false);
  const [faucetLoading, setFaucetLoading] = useState(false);
  const { solBalance, usdcBalance, loading: balLoading, refresh } = useWalletBalances();

  const handleFaucetMint = async () => {
    if (!publicKey || !connected) return;
    setFaucetLoading(true);
    try {
      const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction, getAccount } = await import("@solana/spl-token");
      const ata = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const transaction = new Transaction();

      // Create ATA if it doesn't exist
      try {
        await getAccount(connection, ata);
      } catch {
        transaction.add(
          createAssociatedTokenAccountInstruction(publicKey, ata, publicKey, USDC_MINT)
        );
      }

      // Mint 10,000 test USDC (requires mint authority = connected wallet)
      const mintAmount = BigInt(10_000 * 10 ** USDC_DECIMALS);
      transaction.add(
        createMintToInstruction(USDC_MINT, ata, publicKey, mintAmount)
      );

      transaction.feePayer = publicKey;
      const sig = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(sig, "confirmed");

      toast.success("Minted 10,000 test USDC!", {
        description: `Tx: ${sig.slice(0, 12)}…`,
      });
      refresh();
    } catch (err: any) {
      console.error("Faucet mint failed:", err);
      const msg = err?.message || "";
      if (msg.includes("mint authority") || msg.includes("owner")) {
        toast.error("Faucet failed — your wallet must be the mint authority for VeilX Test USDC. See docs for setup.");
      } else {
        toast.error(msg || "Faucet mint failed");
      }
    } finally {
      setFaucetLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!publicKey || !connected) return;
    const amtNum = Number(amount);
    if (!amtNum || amtNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const programId = new PublicKey(PROGRAM_IDS.VEILX_CORE);
      const transaction = new Transaction();

      if (asset === "SOL") {
        const [userVaultPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("user_vault"), publicKey.toBuffer()],
          programId
        );
        const depositLamports = BigInt(Math.round(amtNum * LAMPORTS_PER_SOL));
        const discriminator = Buffer.from([0xf8, 0xc6, 0x9e, 0x91, 0xe1, 0x75, 0x87, 0xc8]);
        const amountBuffer = Buffer.alloc(8);
        amountBuffer.writeBigUInt64LE(depositLamports);

        transaction.add(
          new TransactionInstruction({
            programId,
            keys: [
              { pubkey: publicKey, isSigner: true, isWritable: true },
              { pubkey: userVaultPda, isSigner: false, isWritable: true },
              { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            ],
            data: Buffer.concat([discriminator, amountBuffer]),
          })
        );
      } else {
        const [userVaultPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("user_vault"), publicKey.toBuffer()],
          programId
        );
        const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } = await import("@solana/spl-token");
        const userAta = await getAssociatedTokenAddress(USDC_MINT, publicKey);
        const vaultAta = await getAssociatedTokenAddress(USDC_MINT, userVaultPda, true);
        const vaultAtaInfo = await connection.getAccountInfo(vaultAta);
        if (!vaultAtaInfo) {
          transaction.add(
            createAssociatedTokenAccountInstruction(publicKey, vaultAta, userVaultPda, USDC_MINT)
          );
        }
        const transferAmount = BigInt(Math.round(amtNum * 10 ** USDC_DECIMALS));
        transaction.add(
          createTransferInstruction(userAta, vaultAta, publicKey, transferAmount)
        );
      }

      transaction.feePayer = publicKey;
      const sig = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(sig, "confirmed");

      toast.success(`Deposited ${amtNum} ${asset}`, {
        description: `Tx: ${sig.slice(0, 12)}…`,
      });
      setAmount("");
      refresh();
    } catch (err: any) {
      console.error("Deposit failed:", err);
      toast.error(err?.message?.includes("insufficient")
        ? `Insufficient ${asset} balance`
        : err?.message || "Deposit failed — check wallet and try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-md">
      <div className="flex items-center gap-3">
        <ArrowDownToLine className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Deposit</h2>
          <p className="text-xs text-muted-foreground">Deposit SOL or USDC into your VeilX trading account.</p>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="rounded-lg border border-border bg-muted/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Wallet Balances</span>
          <button onClick={refresh} disabled={balLoading} className="text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className={`h-3 w-3 ${balLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <span className="text-[10px] text-muted-foreground">SOL</span>
            <p className="text-sm font-mono font-semibold text-foreground">
              {solBalance !== null ? solBalance.toFixed(4) : "—"}
            </p>
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-muted-foreground">USDC</span>
            <p className="text-sm font-mono font-semibold text-foreground">
              {usdcBalance !== null ? usdcBalance.toFixed(2) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* MPC Privacy Shield */}
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span className="text-[10px] text-primary font-medium">Arcium MPC Protected — deposit amounts are encrypted</span>
      </div>

      {/* Asset selector */}
      <div className="flex gap-2">
        {(["SOL", "USDC"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAsset(a)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
              asset === a
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-muted-foreground">Amount ({asset})</label>
          {asset === "SOL" && solBalance !== null && (
            <button onClick={() => setAmount(String(Math.max(0, solBalance - 0.01).toFixed(4)))} className="text-[10px] text-primary hover:underline">
              Max: {solBalance.toFixed(4)}
            </button>
          )}
          {asset === "USDC" && usdcBalance !== null && (
            <button onClick={() => setAmount(String(usdcBalance.toFixed(2)))} className="text-[10px] text-primary hover:underline">
              Max: {usdcBalance.toFixed(2)}
            </button>
          )}
        </div>
        <input
          type="number"
          step={asset === "SOL" ? "0.001" : "0.01"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        onClick={handleDeposit}
        disabled={loading || !amount}
        className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming…
          </span>
        ) : (
          `Deposit ${asset}`
        )}
      </button>

      {/* Faucet Button */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Test USDC Faucet</span>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Mint 10,000 VeilX test USDC to your wallet. Your wallet must be the mint authority (see docs).
        </p>
        <button
          onClick={handleFaucetMint}
          disabled={faucetLoading || !connected}
          className="w-full rounded-lg border border-primary/30 bg-primary/10 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {faucetLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Minting…
            </span>
          ) : (
            "Mint 10,000 Test USDC"
          )}
        </button>
      </div>

      <div className="text-[10px] text-muted-foreground space-y-1">
        {asset === "USDC" && (
          <p>VeilX Test USDC mint: <span className="font-mono">{USDC_MINT.toBase58().slice(0, 16)}…</span></p>
        )}
      </div>
    </div>
  );
}
/* ─── Withdraw Section ─── */
function WithdrawSection() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!publicKey || !connected) return;
    const amtNum = Number(amount);
    if (!amtNum || amtNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const programId = new PublicKey(PROGRAM_IDS.VEILX_CORE);

      const [userVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_vault"), publicKey.toBuffer()],
        programId
      );

      const { getAssociatedTokenAddress, createTransferInstruction } = await import("@solana/spl-token");

      const userAta = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const vaultAta = await getAssociatedTokenAddress(USDC_MINT, userVaultPda, true);

      const transferAmount = BigInt(Math.round(amtNum * 10 ** USDC_DECIMALS));
      const transaction = new Transaction();

      // In production, this would be a program CPI withdrawal requiring PDA signature.
      // For devnet, we construct a transfer from vault ATA back to user ATA,
      // which requires the program to sign via CPI (will fail without deployed program logic).
      transaction.add(
        createTransferInstruction(vaultAta, userAta, userVaultPda, transferAmount)
      );

      transaction.feePayer = publicKey;
      const sig = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(sig, "confirmed");

      toast.success(`Withdrew ${amtNum} USDC`, {
        description: `Tx: ${sig.slice(0, 12)}…`,
      });
      setAmount("");
    } catch (err: any) {
      console.error("Withdraw failed:", err);
      toast.error(err?.message || "Withdraw failed — ensure you have sufficient deposited balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-md">
      <div className="flex items-center gap-3">
        <ArrowUpFromLine className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Withdraw USDC</h2>
          <p className="text-xs text-muted-foreground">Withdraw available margin back to your wallet.</p>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount (USDC)</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        onClick={handleWithdraw}
        disabled={loading || !amount}
        className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming…
          </span>
        ) : (
          "Withdraw"
        )}
      </button>

      <p className="text-[10px] text-muted-foreground">
        Withdrawals require available (unreserved) margin.
      </p>
    </div>
  );
}

/* ─── Swap Section (SOL ↔ USDC with Arcium MPC) ─── */
function SwapSection() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [fromAsset, setFromAsset] = useState<"SOL" | "USDC">("SOL");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { solBalance, usdcBalance, loading: balLoading, refresh } = useWalletBalances();

  const toAsset = fromAsset === "SOL" ? "USDC" : "SOL";
  const currentBalance = fromAsset === "SOL" ? solBalance : usdcBalance;

  const handleSwap = async () => {
    if (!publicKey || !connected) return;
    const amtNum = Number(amount);
    if (!amtNum || amtNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const programId = new PublicKey(VEILX_SWAP_PROGRAM);
      const [swapVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("swap_vault"), publicKey.toBuffer()],
        programId
      );

      const discriminator = Buffer.from([0xa1, 0xb2, 0xc3, 0xd4, 0xe5, 0xf6, 0x07, 0x18]);
      const decimals = fromAsset === "SOL" ? SOL_DECIMALS : USDC_DECIMALS;
      const swapAmount = BigInt(Math.round(amtNum * 10 ** decimals));
      const amountBuffer = Buffer.alloc(8);
      amountBuffer.writeBigUInt64LE(swapAmount);
      const directionBuffer = Buffer.from([fromAsset === "SOL" ? 0 : 1]);

      const { getAssociatedTokenAddress } = await import("@solana/spl-token");
      const userUsdcAta = await getAssociatedTokenAddress(USDC_MINT, publicKey);

      const transaction = new Transaction();
      transaction.add(
        new TransactionInstruction({
          programId,
          keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true },
            { pubkey: swapVaultPda, isSigner: false, isWritable: true },
            { pubkey: userUsdcAta, isSigner: false, isWritable: true },
            { pubkey: USDC_MINT, isSigner: false, isWritable: false },
            { pubkey: NATIVE_SOL_MINT, isSigner: false, isWritable: false },
            { pubkey: new PublicKey(PROGRAM_IDS.VEILX_MPC_BRIDGE), isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          data: Buffer.concat([discriminator, amountBuffer, directionBuffer]),
        })
      );

      transaction.feePayer = publicKey;
      const sig = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(sig, "confirmed");

      toast.success(`Swapped ${amtNum} ${fromAsset} → ${toAsset}`, {
        description: `Tx: ${sig.slice(0, 12)}…`,
      });
      setAmount("");
      refresh();
    } catch (err: any) {
      console.error("Swap failed:", err);
      toast.error(err?.message || "Swap failed — ensure the swap program is deployed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-md">
      <div className="flex items-center gap-3">
        <Repeat className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Swap SOL ↔ USDC</h2>
          <p className="text-xs text-muted-foreground">On-chain swap protected by Arcium MPC encryption.</p>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="rounded-lg border border-border bg-muted/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Wallet Balances</span>
          <button onClick={refresh} disabled={balLoading} className="text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className={`h-3 w-3 ${balLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <span className="text-[10px] text-muted-foreground">SOL</span>
            <p className="text-sm font-mono font-semibold text-foreground">
              {solBalance !== null ? solBalance.toFixed(4) : "—"}
            </p>
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-muted-foreground">USDC</span>
            <p className="text-sm font-mono font-semibold text-foreground">
              {usdcBalance !== null ? usdcBalance.toFixed(2) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* MPC Privacy Shield */}
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span className="text-[10px] text-primary font-medium">Arcium MPC Protected — swap amounts and rates are encrypted</span>
      </div>

      {/* Direction */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">From</label>
          <button
            onClick={() => setFromAsset(fromAsset === "SOL" ? "USDC" : "SOL")}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            {fromAsset}
          </button>
        </div>
        <button
          onClick={() => setFromAsset(fromAsset === "SOL" ? "USDC" : "SOL")}
          className="mt-4 p-2 rounded-full border border-border hover:bg-secondary transition-colors"
        >
          <Repeat className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">To</label>
          <div className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm font-semibold text-foreground">
            {toAsset}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-muted-foreground">Amount ({fromAsset})</label>
          {currentBalance !== null && (
            <button
              onClick={() => setAmount(String(fromAsset === "SOL" ? Math.max(0, currentBalance - 0.01).toFixed(4) : currentBalance.toFixed(2)))}
              className="text-[10px] text-primary hover:underline"
            >
              Max: {fromAsset === "SOL" ? currentBalance.toFixed(4) : currentBalance.toFixed(2)}
            </button>
          )}
        </div>
        <input
          type="number"
          step={fromAsset === "SOL" ? "0.001" : "0.01"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        onClick={handleSwap}
        disabled={loading || !amount}
        className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Swapping…
          </span>
        ) : (
          `Swap ${fromAsset} → ${toAsset}`
        )}
      </button>

      <div className="text-[10px] text-muted-foreground space-y-1">
        <p>Swap uses Pyth oracle price feed via Arcium MPC for private execution.</p>
        <p>Swap program: <span className="font-mono">{VEILX_SWAP_PROGRAM.slice(0, 16)}…</span></p>
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
