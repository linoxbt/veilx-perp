import { useState, useEffect, useCallback, useRef } from "react";

// ── Pyth Hermes price feed IDs (hex) ─────────────────────────────
const PYTH_FEED_IDS: Record<string, string> = {
  SOL: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  ARB: "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5",
};

// CoinGecko fallback for 24h change & volume
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

function buildHermesUrl(): string {
  const ids = Object.values(PYTH_FEED_IDS)
    .map((id) => `ids[]=${id}`)
    .join("&");
  return `${HERMES_BASE}/v2/updates/price/latest?${ids}&parsed=true`;
}

const COINGECKO_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(COINGECKO_IDS).join(",")}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;

// Reverse maps
const PYTH_ID_TO_SYMBOL = Object.fromEntries(
  Object.entries(PYTH_FEED_IDS).map(([sym, id]) => [id.replace("0x", ""), sym])
);
const CG_ID_TO_SYMBOL = Object.fromEntries(
  Object.entries(COINGECKO_IDS).map(([sym, id]) => [id, sym])
);

export function usePriceOracle(pollIntervalMs = 2_000) {
  const [prices, setPrices] = useState<PriceMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const cgCacheRef = useRef<Record<string, { change24h: number; volume24h: number }>>({});

  // Fetch 24h stats from CoinGecko (less frequent)
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
      // silently fail — CoinGecko is supplementary
    }
  }, []);

  // Fetch real-time prices from Pyth Hermes
  const fetchPythPrices = useCallback(async () => {
    try {
      const res = await fetch(buildHermesUrl());
      if (!res.ok) throw new Error(`Pyth Hermes ${res.status}`);
      const data = await res.json();

      const parsed: PriceMap = {};

      for (const item of data.parsed ?? []) {
        const feedId = item.id;
        const sym = PYTH_ID_TO_SYMBOL[feedId];
        if (!sym) continue;

        const priceData = item.price;
        const price = Number(priceData.price) * Math.pow(10, Number(priceData.expo));
        const confidence = Number(priceData.conf) * Math.pow(10, Number(priceData.expo));

        const cgStats = cgCacheRef.current[sym];

        parsed[sym] = {
          symbol: sym,
          price,
          confidence,
          change24h: cgStats?.change24h ?? 0,
          volume24h: cgStats?.volume24h ?? 0,
          lastUpdated: Number(priceData.publish_time) * 1000,
          source: "pyth",
        };
      }

      // Also store with "SYMBOL/USD" keys for compatibility
      for (const [sym, data] of Object.entries(parsed)) {
        parsed[`${sym}/USD`] = data;
      }

      setPrices(parsed);
      setError(null);
    } catch (err: any) {
      // Fallback to CoinGecko if Pyth fails
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
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoinGeckoStats();
    fetchPythPrices();

    // Pyth: fast polling (every 2s default)
    intervalRef.current = setInterval(fetchPythPrices, pollIntervalMs);

    // CoinGecko stats: refresh every 60s
    const cgInterval = setInterval(fetchCoinGeckoStats, 60_000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(cgInterval);
    };
  }, [fetchPythPrices, fetchCoinGeckoStats, pollIntervalMs]);

  return { prices, loading, error, symbols: SYMBOLS, refetch: fetchPythPrices };
}
