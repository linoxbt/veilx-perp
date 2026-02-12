import { Link } from "react-router-dom";
import veilxLogo from "@/assets/veilx-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={veilxLogo} alt="VeilX" className="h-6 w-6 rounded" />
          <span className="font-bold text-foreground text-sm">VeilX</span>
          <span className="text-[10px] text-muted-foreground ml-2">Built on Solana × Arcium</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/trade" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Trade</Link>
          <Link to="/portfolio" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
          <Link to="/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[10px] text-muted-foreground">
            Private perpetual futures powered by MPC.
          </p>
          <a
            href="https://x.com/lino"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Built by Lino
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
