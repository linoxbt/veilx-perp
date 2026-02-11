import { useState, useCallback } from "react";

export interface Order {
  id: string;
  side: "long" | "short";
  type: "market" | "limit";
  size: number;
  price: number | null;
  leverage: number;
  stopLoss: number | null;
  takeProfit: number | null;
  market: string;
  status: "open" | "filled" | "cancelled";
  timestamp: number;
  entryPrice: number;
  pnl: number;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const submitOrder = useCallback((order: Omit<Order, "id" | "status" | "timestamp" | "entryPrice" | "pnl">) => {
    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
      status: order.type === "market" ? "filled" : "open",
      timestamp: Date.now(),
      entryPrice: order.price ?? 0,
      pnl: 0,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "cancelled" as const } : o))
    );
  }, []);

  const positions = orders.filter((o) => o.status === "filled");
  const openOrders = orders.filter((o) => o.status === "open");
  const history = orders.filter((o) => o.status === "cancelled" || o.status === "filled");

  return { orders, positions, openOrders, history, submitOrder, cancelOrder };
};
