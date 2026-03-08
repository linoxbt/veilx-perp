import { useState, useEffect } from "react";
import veilxLogo from "@/assets/veilx-logo.png";

interface LoadingScreenProps {
  onFinished: () => void;
  minDuration?: number;
}

const LoadingScreen = ({ onFinished, minDuration = 2000 }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(onFinished, 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDuration, onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo with pulse animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
        <img
          src={veilxLogo}
          alt="VeilX"
          className="relative h-20 w-20 object-contain animate-[pulse_1.5s_ease-in-out_infinite]"
        />
      </div>

      {/* Brand name */}
      <h1 className="text-2xl font-bold font-mono text-foreground mb-1 tracking-wider">
        VeilX
      </h1>
      <p className="text-xs text-muted-foreground font-mono mb-8">
        Private Perpetuals on Solana
      </p>

      {/* Progress bar */}
      <div className="w-48 h-0.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status text */}
      <p className="mt-3 text-[10px] font-mono text-muted-foreground">
        {progress < 30
          ? "Initializing Arcium MPC…"
          : progress < 60
          ? "Connecting Pyth oracles…"
          : progress < 90
          ? "Loading markets…"
          : "Ready"}
      </p>
    </div>
  );
};

export default LoadingScreen;
