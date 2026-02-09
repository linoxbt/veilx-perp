import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <span className="font-bold text-foreground">VeilX</span>
          <span className="text-xs text-muted-foreground ml-2">Built on Solana × Arcium</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
          <a href="/#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Features</a>
        </div>
        <p className="text-xs text-muted-foreground">
          Private perpetual futures powered by multi-party computation. Open source.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
