import { Shield, Lock, Eye, Server, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Lock,
    title: "Encrypt Order",
    desc: "Your order (size, direction, leverage, limit price) is encrypted client-side using Arcium's MPC protocol before leaving your browser.",
  },
  {
    icon: Server,
    title: "Private Computation",
    desc: "Arcium's MPC nodes match orders, check collateral, and evaluate liquidation thresholds — all on encrypted data. No single node sees the plaintext.",
  },
  {
    icon: Shield,
    title: "Execute Privately",
    desc: "Matched trades settle on Solana. Position details remain encrypted. Liquidation checks run privately — no one can target your stops.",
  },
  {
    icon: Eye,
    title: "Reveal Only PnL",
    desc: "When you close a position, only the final PnL is revealed on-chain. Entry price, size, and strategy remain permanently private.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-gradient">Arcium</span> Protects You
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Multi-Party Computation ensures no single party — not even the protocol — can see your trading data.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <div className="rounded-xl border border-border bg-card p-6 h-full hover:border-primary/30 transition-colors">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:glow-primary transition-shadow">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-mono text-primary mb-2">Step {i + 1}</div>
                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
