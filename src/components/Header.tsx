import { Eye, Lock, Wallet, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const WALLETS = [
  { name: "Phantom", icon: "👻" },
  { name: "Solflare", icon: "🔥" },
  { name: "Backpack", icon: "🎒" },
  { name: "Torus", icon: "🔵" },
  { name: "Ledger", icon: "🔒" },
];

const Header = () => {
  const [walletOpen, setWalletOpen] = useState(false);
  const [connected, setConnected] = useState<string | null>(null);

  const handleConnect = (walletName: string) => {
    setConnected(walletName);
    setWalletOpen(false);
  };

  const handleDisconnect = () => {
    setConnected(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Eye className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-gradient">Veil</span>
            <span className="text-foreground">X</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#trade" className="hover:text-foreground transition-colors">Trade</a>
          <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
          <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-mono text-primary">
            <Lock className="h-3 w-3" />
            <span>Arcium Secured</span>
          </div>

          <div className="relative">
            {connected ? (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <Wallet className="h-4 w-4" />
                <span className="font-mono text-xs">{connected}</span>
              </button>
            ) : (
              <button
                onClick={() => setWalletOpen(!walletOpen)}
                className="flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
                <ChevronDown className={`h-3 w-3 transition-transform ${walletOpen ? "rotate-180" : ""}`} />
              </button>
            )}

            {walletOpen && !connected && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl animate-fade-in">
                <p className="px-3 py-2 text-xs text-muted-foreground font-medium">Select Wallet</p>
                {WALLETS.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => handleConnect(wallet.name)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <span className="text-lg">{wallet.icon}</span>
                    {wallet.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
