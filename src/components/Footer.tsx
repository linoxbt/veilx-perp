import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-bold text-foreground">ShadowPerps</span>
          <span className="text-xs text-muted-foreground ml-2">Built on Solana × Arcium</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Private perpetual futures powered by multi-party computation. Open source.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
