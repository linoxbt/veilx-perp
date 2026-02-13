import { useState, useEffect } from "react";
import { Lock, Server, Shield, Eye, ArrowRight } from "lucide-react";

const nodes = [
  {
    id: "client",
    label: "Client Browser",
    icon: Eye,
    desc: "Encrypt order params",
    x: 0,
    color: "primary",
  },
  {
    id: "arcium",
    label: "Arcium MPC",
    icon: Server,
    desc: "3-of-5 encrypted compute",
    x: 1,
    color: "accent",
  },
  {
    id: "solana",
    label: "Solana Program",
    icon: Shield,
    desc: "Settle + verify proofs",
    x: 2,
    color: "profit",
  },
];

const dataPackets = [
  { id: 0, label: "Encrypted Order", from: 0, to: 1 },
  { id: 1, label: "MPC Proof", from: 1, to: 2 },
  { id: 2, label: "PnL Result", from: 2, to: 0 },
];

const ArchitectureDiagram = () => {
  const [activePacket, setActivePacket] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActivePacket((p) => (p + 1) % dataPackets.length);
          return 0;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const packet = dataPackets[activePacket];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs text-accent mb-4">
            <Lock className="h-3 w-3" />
            Privacy Architecture
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-gradient">Data Flows</span> Privately
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Your order is encrypted client-side, computed on by Arcium's MPC nodes (no single node sees plaintext), then verified on Solana.
          </p>
        </div>

        {/* Architecture Nodes */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {nodes.map((node, i) => {
              const isActive =
                (packet.from === i && progress < 50) ||
                (packet.to === i && progress >= 50);
              return (
                <div
                  key={node.id}
                  className={`relative rounded-xl border p-5 md:p-6 text-center transition-all duration-300 ${
                    isActive
                      ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-primary/20 text-primary scale-110"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <node.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{node.label}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{node.desc}</p>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      Step {i + 1}
                    </div>
                  </div>
                  
                  {/* Arrow between nodes (desktop) */}
                  {i < nodes.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 z-10" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Active data packet indicator */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-foreground">
                  {packet.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {nodes[packet.from].label} → {nodes[packet.to].label}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full gradient-primary transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {dataPackets.map((dp, i) => (
                <div
                  key={dp.id}
                  className={`text-center rounded-lg py-1.5 text-[10px] font-medium transition-colors ${
                    i === activePacket
                      ? "bg-primary/10 text-primary"
                      : i < activePacket
                      ? "text-profit"
                      : "text-muted-foreground"
                  }`}
                >
                  {dp.label}
                </div>
              ))}
            </div>
          </div>

          {/* What stays private */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl border border-profit/20 bg-profit/5 p-4">
              <p className="text-xs font-semibold text-profit mb-2">🔒 Always Private</p>
              <ul className="text-[11px] text-muted-foreground space-y-1">
                <li>• Position size & leverage</li>
                <li>• Entry price & strategy</li>
                <li>• Liquidation threshold</li>
                <li>• Stop-loss & take-profit</li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-xs font-semibold text-accent mb-2">📊 Selectively Public</p>
              <ul className="text-[11px] text-muted-foreground space-y-1">
                <li>• Final PnL on close</li>
                <li>• Liquidation boolean</li>
                <li>• Aggregate open interest</li>
                <li>• Funding rates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureDiagram;
