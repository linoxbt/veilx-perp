import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

const AnimatedNumber = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  className = "",
  duration = 600,
}: AnimatedNumberProps) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number>();
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    setFlash(to > from ? "up" : "down");
    const timeout = setTimeout(() => setFlash(null), 500);

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      className={`transition-colors duration-300 ${
        flash === "up" ? "text-profit" : flash === "down" ? "text-loss" : ""
      } ${className}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
