import { useState, useEffect, useCallback, useRef } from "react";

// ── Pyth Hermes SSE price feed IDs (hex) ─────────────────────────
const PYTH_FEED_IDS: Record<string, string> = {
  SOL: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  ARB: "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5",
};

// CoinGecko for 24h change & volume (supplementary)
const COINGECKO_IDS: Record<string, string> = {
  SOL: "solana",
  ETH: "ethereum",
  BTC: "bitcoin",
  ARB: "arbitrum",
};

export interface TokenPrice {
  symbol: string;
  price: number;
  confidence: number;
  change24h: number;
  volume24h: number;
  lastUpdated: number;
  source: "pyth" | "coingecko" | "fallback";
}

type PriceMap = Record<string, TokenPrice>;

const SYMBOLS = Object.keys(PYTH_FEED_IDS);
const HERMES_BASE = "https://hermes.pyth.network";

const COINGECKO_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(COINGECKO_IDS).join(",")}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;

// Reverse maps
const PYTH_ID_TO_SYMBOL = Object.fromEntries(
  Object.entries(PYTH_FEED_IDS).map(([sym, id]) => [id.replace("0x", ""), sym])
);
const CG_ID_TO_SYMBOL = Object.fromEntries(
  Object.entries(COINGECKO_IDS).map(([sym, id]) => [id, sym])
);

function buildSSEUrl(): string {
  const ids = Object.values(PYTH_FEED_IDS)
    .map((id) => `ids[]=${id}`)
    .join("&");
  return `${HERMES_BASE}/v2/updates/price/stream?${ids}&parsed=true&allow_unordered=true&benchmarks_only=false`;
}

function buildRestUrl(): string {
  const ids = Object.values(PYTH_FEED_IDS)
    .map((id) => `ids[]=${id}`)
    .join("&");
  return `${HERMES_BASE}/v2/updates/price/latest?${ids}&parsed=true`;
}

function parsePythPrice(item: any): { sym: string; price: number; confidence: number; publishTime: number } | null {
  const feedId = item.id;
  const sym = PYTH_ID_TO_SYMBOL[feedId];
  if (!sym) return null;

  const priceData = item.price;
  const price = Number(priceData.price) * Math.pow(10, Number(priceData.expo));
  const confidence = Number(priceData.conf) * Math.pow(10, Number(priceData.expo));

  return { sym, price, confidence, publishTime: Number(priceData.publish_time) * 1000 };
}

export function usePriceOracle(_pollIntervalMs?: number) {
  const [prices, setPrices] = useState<PriceMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const cgCacheRef = useRef<Record<string, { change24h: number; volume24h: number }>>({});
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Fetch 24h stats from CoinGecko (supplementary)
  const fetchCoinGeckoStats = useCallback(async () => {
    try {
      const res = await fetch(COINGECKO_URL);
      if (!res.ok) return;
      const data = await res.json();
      const cache: Record<string, { change24h: number; volume24h: number }> = {};
      for (const [cgId, sym] of Object.entries(CG_ID_TO_SYMBOL)) {
        const entry = data[cgId];
        if (entry) {
          cache[sym] = {
            change24h: entry.usd_24h_change ?? 0,
            volume24h: entry.usd_24h_vol ?? 0,
          };
        }
      }
      cgCacheRef.current = cache;
    } catch {
      // silently fail
    }
  }, []);

  // One-shot REST fallback
  const fetchRestFallback = useCallback(async () => {
    try {
      const res = await fetch(buildRestUrl());
      if (!res.ok) throw new Error(`Pyth REST ${res.status}`);
      const data = await res.json();

      setPrices((prev) => {
        const updated = { ...prev };
        for (const item of data.parsed ?? []) {
          const parsed = parsePythPrice(item);
          if (!parsed) continue;
          const cgStats = cgCacheRef.current[parsed.sym];
          const entry: TokenPrice = {
            symbol: parsed.sym,
            price: parsed.price,
            confidence: parsed.confidence,
            change24h: cgStats?.change24h ?? prev[parsed.sym]?.change24h ?? 0,
            volume24h: cgStats?.volume24h ?? prev[parsed.sym]?.volume24h ?? 0,
            lastUpdated: parsed.publishTime,
            source: "pyth",
          };
          updated[parsed.sym] = entry;
          updated[`${parsed.sym}/USD`] = entry;
        }
        return updated;
      });
      setError(null);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      // Try CoinGecko as last resort
      try {
        const res = await fetch(COINGECKO_URL);
        if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
        const data = await res.json();
        const fallback: PriceMap = {};
        for (const [cgId, sym] of Object.entries(CG_ID_TO_SYMBOL)) {
          const entry = data[cgId];
          if (entry) {
            const p: TokenPrice = {
              symbol: sym,
              price: entry.usd ?? 0,
              confidence: 0,
              change24h: entry.usd_24h_change ?? 0,
              volume24h: entry.usd_24h_vol ?? 0,
              lastUpdated: Date.now(),
              source: "coingecko",
            };
            fallback[sym] = p;
            fallback[`${sym}/USD`] = p;
          }
        }
        setPrices(fallback);
      } catch {
        // both failed
      }
      setLoading(false);
    }
  }, []);

  // Connect SSE stream
  const connectSSE = useCallback(() => {
    // Clean up existing
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(buildSSEUrl());
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setError(null);
      setLoading(false);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const items = data.parsed ?? [];

        setPrices((prev) => {
          const updated = { ...prev };
          for (const item of items) {
            const parsed = parsePythPrice(item);
            if (!parsed) continue;
            const cgStats = cgCacheRef.current[parsed.sym];
            const entry: TokenPrice = {
              symbol: parsed.sym,
              price: parsed.price,
              confidence: parsed.confidence,
              change24h: cgStats?.change24h ?? prev[parsed.sym]?.change24h ?? 0,
              volume24h: cgStats?.volume24h ?? prev[parsed.sym]?.volume24h ?? 0,
              lastUpdated: parsed.publishTime,
              source: "pyth",
            };
            updated[parsed.sym] = entry;
            updated[`${parsed.sym}/USD`] = entry;
          }
          return updated;
        });
      } catch {
        // skip malformed messages
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      eventSourceRef.current = null;

      // Reconnect with backoff
      reconnectTimeoutRef.current = setTimeout(() => {
        connectSSE();
      }, 3000);
    };
  }, []);

  useEffect(() => {
    // Initial data: REST for instant load, then SSE for streaming
    fetchCoinGeckoStats();
    fetchRestFallback().then(() => {
      connectSSE();
    });

    // Refresh CoinGecko stats every 60s
    const cgInterval = setInterval(fetchCoinGeckoStats, 60_000);

    return () => {
      clearInterval(cgInterval);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [fetchCoinGeckoStats, fetchRestFallback, connectSSE]);

  return { prices, loading, error, symbols: SYMBOLS, connected, refetch: fetchRestFallback };
}
