import { Eye, Lock, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  const { connected, publicKey } = useWallet();

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

          {connected && publicKey && (
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-profit/30 bg-profit/10 px-3 py-1.5 text-xs font-mono text-profit">
              <Wallet className="h-3 w-3" />
              <span>{publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</span>
            </div>
          )}

          <WalletMultiButton className="!rounded-lg !font-sans !text-sm !font-semibold !h-10" />
        </div>
      </div>
    </header>
  );
};

export default Header;
