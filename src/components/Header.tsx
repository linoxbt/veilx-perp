import { useState, useEffect } from "react";
import { Lock, Wallet, Menu, X, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import veilxLogo from "@/assets/veilx-logo.png";

const NAV_ITEMS = [
  { to: "/trade", label: "Trade" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/docs", label: "Docs" },
];

const Header = () => {
  const { connected, publicKey } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("veilx-theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("veilx-theme", theme);
  }, [theme]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between px-3 sm:px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={veilxLogo} alt="VeilX" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg" />
          <span className="text-base sm:text-lg font-bold tracking-tight">
            <span className="text-gradient">Veil</span>
            <span className="text-foreground">X</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="hover:text-foreground transition-colors" activeClassName="text-foreground">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2 sm:px-2.5 py-1 text-[10px] font-mono text-primary">
            <Lock className="h-3 w-3" />
            <span className="hidden sm:inline">Arcium Secured</span>
          </div>

          {connected && publicKey && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-profit/30 bg-profit/10 px-2.5 py-1 text-[10px] font-mono text-profit">
              <Wallet className="h-3 w-3" />
              <span>{publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</span>
            </div>
          )}

          <WalletMultiButton className="!rounded-lg !font-sans !text-xs !font-semibold !h-8 sm:!h-9 !px-3 sm:!px-4" />

          <button
            className="md:hidden flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in">
          <nav className="container flex flex-col gap-1 py-3 px-3 sm:px-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                activeClassName="bg-secondary text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
