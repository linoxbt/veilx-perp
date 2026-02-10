import { useState, useEffect, useCallback, useRef } from "react";

// CoinGecko IDs for supported tokens
const COINGECKO_IDS: Record<string, string> = {
  SOL: "solana",
  ETH: "ethereum",
  BTC: "bitcoin",
  ARB: "arbitrum",
};

export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  lastUpdated: number;
}

type PriceMap = Record<string, TokenPrice>;

const SYMBOLS = Object.keys(COINGECKO_IDS);
const COINGECKO_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(COINGECKO_IDS).join(",")}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;

// Reverse map: coingecko id → symbol
const ID_TO_SYMBOL = Object.fromEntries(
  Object.entries(COINGECKO_IDS).map(([sym, id]) => [id, sym])
);

export function usePriceOracle(pollIntervalMs = 30_000) {
  const [prices, setPrices] = useState<PriceMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(COINGECKO_URL);
      if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
      const data = await res.json();

      const newPrices: PriceMap = {};
      for (const [cgId, sym] of Object.entries(ID_TO_SYMBOL)) {
        const entry = data[cgId];
        if (entry) {
          newPrices[sym] = {
            symbol: sym,
            price: entry.usd ?? 0,
            change24h: entry.usd_24h_change ?? 0,
            volume24h: entry.usd_24h_vol ?? 0,
            lastUpdated: Date.now(),
          };
        }
      }
      setPrices(newPrices);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, pollIntervalMs);
    return () => clearInterval(intervalRef.current);
  }, [fetchPrices, pollIntervalMs]);

  return { prices, loading, error, symbols: SYMBOLS, refetch: fetchPrices };
}
