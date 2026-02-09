import { Eye, EyeOff, Lock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative z-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary mb-8 animate-fade-in">
          <Lock className="h-3.5 w-3.5" />
          Powered by Arcium MPC on Solana
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up">
          <span className="text-foreground">Trade Perps.</span>
          <br />
          <span className="text-gradient">Stay Private.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Your positions, orders, and liquidation thresholds are encrypted with Arcium's MPC. 
          Only final PnL is revealed — eliminating front-running, copy-trading exploits, and targeted liquidations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <a
            href="#trade"
            className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
          >
            <Eye className="h-4 w-4" />
            Start Trading
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-8 py-3.5 text-base font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Learn More
          </a>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {[
            { label: "Encrypted Orders", icon: EyeOff },
            { label: "Private Positions", icon: Lock },
            { label: "Hidden Liquidations", icon: Eye },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
