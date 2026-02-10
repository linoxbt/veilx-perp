import { EyeOff, Lock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-14">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative z-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-8 animate-fade-in">
          <Lock className="h-3 w-3" />
          Powered by Arcium MPC on Solana
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 animate-slide-up">
          <span className="text-foreground">Trade Perps.</span>
          <br />
          <span className="text-gradient">Stay Private.</span>
        </h1>

        <p className="max-w-xl mx-auto text-base md:text-lg text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Encrypted positions, orders, and liquidations via Arcium's MPC — eliminating front-running and copy-trading.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link
            to="/trade"
            className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
          >
            <Eye className="h-4 w-4" />
            Start Trading
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Learn More
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {[
            { label: "Encrypted Orders", icon: EyeOff },
            { label: "Private Positions", icon: Lock },
            { label: "Hidden Liquidations", icon: Eye },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
