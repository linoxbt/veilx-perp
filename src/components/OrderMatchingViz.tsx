import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Lock, Zap, Server, ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { id: 1, label: "Encrypt", icon: Lock, description: "Order encrypted client-side", color: "text-primary" },
  { id: 2, label: "Secret Share", icon: Server, description: "Split across 3-of-5 MPC nodes", color: "text-accent" },
  { id: 3, label: "MPC Match", icon: Zap, description: "Orders matched on ciphertext", color: "text-profit" },
  { id: 4, label: "Settle", icon: CheckCircle, description: "Result verified on Solana", color: "text-foreground" },
];

interface MatchEvent {
  id: string;
  market: string;
  time: string;
  encryptedPayload: string;
  status: "matched" | "pending" | "settled";
  matchTime: string;
}

const generateCiphertext = () => {
  const chars = "0123456789abcdef";
  return "0x" + Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * 16)]).join("");
};

const StatCard = ({ label, value, icon: Icon, accent }: { label: string; value: string; icon: any; accent?: string }) => (
  <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      <Icon className={`h-3.5 w-3.5 ${accent || "text-muted-foreground"}`} />
    </div>
    <div className="text-base sm:text-lg font-bold font-mono text-foreground">{value}</div>
  </div>
);

const OrderMatchingViz = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const matchCountRef = useRef(0);

  // Animate through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulate match events
  useEffect(() => {
    const markets = ["SOL/USD", "ETH/USD", "BTC/USD", "ARB/USD"];
    const interval = setInterval(() => {
      matchCountRef.current += 1;
      const newEvent: MatchEvent = {
        id: `match_${matchCountRef.current}`,
        market: markets[Math.floor(Math.random() * markets.length)],
        time: "just now",
        encryptedPayload: generateCiphertext(),
        status: "matched",
        matchTime: `${(Math.random() * 400 + 50).toFixed(0)}ms`,
      };
      setMatchEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Age match events
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchEvents(prev => prev.map((e, i) => ({
        ...e,
        time: i === 0 ? "just now" : i < 3 ? `${i * 4}s ago` : `${i * 4}s ago`,
        status: i > 2 ? "settled" : i > 0 ? "matched" : "pending",
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5">
      {/* MPC Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Arcium MPC Order Matching</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Orders are matched on <strong className="text-foreground">encrypted data</strong> — no single MPC node sees the plaintext order parameters. The matching engine operates on ciphertext, producing a verified match result that is settled on Solana.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Orders Matched" value="12,847" icon={Zap} accent="text-profit" />
        <StatCard label="Avg Match Time" value="187ms" icon={Server} />
        <StatCard label="MPC Nodes Active" value="3/5" icon={ShieldCheck} accent="text-primary" />
        <StatCard label="Match Rate" value="99.7%" icon={CheckCircle} accent="text-profit" />
      </div>

      {/* Animated Flow */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground mb-5">Encrypted Order Flow</h3>

        {/* Desktop flow */}
        <div className="hidden sm:flex items-center justify-between gap-2">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className={`flex flex-col items-center gap-2 flex-1 transition-all duration-500 ${activeStep >= i ? "opacity-100 scale-100" : "opacity-30 scale-95"}`}>
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${
                  activeStep === i
                    ? "border-primary bg-primary/10 shadow-[0_0_15px_hsl(270_95%_65%_/_0.3)]"
                    : activeStep > i
                    ? "border-profit/50 bg-profit/5"
                    : "border-border bg-muted"
                }`}>
                  <step.icon className={`h-5 w-5 ${activeStep >= i ? step.color : "text-muted-foreground"}`} />
                </div>
                <span className={`text-[10px] font-semibold ${activeStep >= i ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                <span className="text-[9px] text-muted-foreground text-center max-w-[100px]">{step.description}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight className={`h-4 w-4 shrink-0 transition-all duration-500 ${activeStep > i ? "text-profit" : "text-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile flow - vertical */}
        <div className="sm:hidden space-y-3">
          {STEPS.map((step, i) => (
            <div key={step.id} className={`flex items-center gap-3 rounded-lg p-3 transition-all duration-500 ${
              activeStep === i ? "bg-primary/10 border border-primary/30" : activeStep > i ? "bg-profit/5 border border-profit/20" : "bg-muted/30 border border-border"
            }`}>
              <step.icon className={`h-5 w-5 shrink-0 ${activeStep >= i ? step.color : "text-muted-foreground"}`} />
              <div>
                <span className={`text-xs font-semibold ${activeStep >= i ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                <p className="text-[10px] text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Data packet animation */}
        <div className="mt-5 rounded-lg bg-muted/50 border border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium text-muted-foreground">Live Encrypted Packet</span>
            <span className="text-[9px] text-primary animate-pulse">● Processing</span>
          </div>
          <code className="text-[10px] font-mono text-foreground/60 break-all">
            {activeStep === 0 && "{ size: ██████, leverage: ██x, price: ██████.██, side: ████ }"}
            {activeStep === 1 && `share[0]: ${generateCiphertext()}  share[1]: ${generateCiphertext()}  share[2]: ${generateCiphertext()}`}
            {activeStep === 2 && `mpc_compute(share[0..3]) → match_result: ${generateCiphertext()}`}
            {activeStep === 3 && `verify_proof(0x${generateCiphertext().slice(2)}) → ✓ settled on Solana`}
            {activeStep === 4 && "awaiting next order..."}
          </code>
        </div>
      </div>

      {/* Live Match Feed */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Live Match Feed</h3>
          <span className="text-[9px] text-profit animate-pulse">● Live</span>
        </div>

        {matchEvents.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">Waiting for matches…</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {matchEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    event.status === "pending" ? "bg-[hsl(var(--warning))] animate-pulse" :
                    event.status === "matched" ? "bg-profit" : "bg-muted-foreground"
                  }`} />
                  <span className="text-xs font-semibold text-foreground">{event.market}</span>
                  <code className="text-[9px] font-mono text-muted-foreground hidden sm:inline">{event.encryptedPayload}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">{event.matchTime}</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                    {event.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-[10px] text-muted-foreground mt-3">
          All payloads shown are encrypted ciphertext. Actual order details (size, price, direction) are never revealed during matching.
        </p>
      </div>
    </div>
  );
};

export default OrderMatchingViz;
