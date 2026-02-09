import { EyeOff, Zap, ShieldCheck, Users, BarChart3, Fingerprint } from "lucide-react";

const features = [
  {
    icon: EyeOff,
    title: "Anti Front-Running",
    desc: "Encrypted orders prevent MEV bots and validators from extracting value by front-running your trades.",
  },
  {
    icon: ShieldCheck,
    title: "Private Liquidations",
    desc: "Liquidation thresholds are computed in MPC — no one can see your liquidation price to target it.",
  },
  {
    icon: Users,
    title: "Anti Copy-Trading",
    desc: "Positions are invisible to other traders, eliminating parasitic copy-trading strategies.",
  },
  {
    icon: Zap,
    title: "Solana Speed",
    desc: "Sub-second finality on Solana with Arcium's optimized MPC layer for minimal latency overhead.",
  },
  {
    icon: BarChart3,
    title: "Deeper Liquidity",
    desc: "Privacy attracts institutional LPs who can provide liquidity without revealing proprietary strategies.",
  },
  {
    icon: Fingerprint,
    title: "Selective Disclosure",
    desc: "Choose what to reveal. Share trade history for compliance while keeping strategies private.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why <span className="text-gradient">Private Perps</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Traditional perp DEXs expose every detail of your trading activity. ShadowPerps changes that.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:bg-card/80 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:glow-primary transition-shadow">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
