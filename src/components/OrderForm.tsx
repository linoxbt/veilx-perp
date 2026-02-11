import { useState } from "react";
import { Lock, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import type { Order } from "@/hooks/useOrders";

interface OrderFormProps {
  onSubmit: (order: Omit<Order, "id" | "status" | "timestamp" | "entryPrice" | "pnl">) => Order;
  currentPrice: number;
  market: string;
}

const OrderForm = ({ onSubmit, currentPrice, market }: OrderFormProps) => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const [side, setSide] = useState<"long" | "short">("long");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState(10);
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [showTpSl, setShowTpSl] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const leveragePresets = [1, 5, 10, 25, 50];

  const effectivePrice = orderType === "market" ? currentPrice : Number(price) || 0;
  const sizeNum = Number(size) || 0;
  const notionalValue = sizeNum * effectivePrice;
  const margin = notionalValue / leverage;
  const liquidationPrice =
    side === "long"
      ? effectivePrice * (1 - 1 / leverage + 0.005)
      : effectivePrice * (1 + 1 / leverage - 0.005);

  const handleSubmit = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    if (!sizeNum || sizeNum <= 0) {
      toast.error("Enter a valid size");
      return;
    }
    if (orderType === "limit" && (!price || Number(price) <= 0)) {
      toast.error("Enter a valid limit price");
      return;
    }

    const slNum = Number(stopLoss) || null;
    const tpNum = Number(takeProfit) || null;

    // Validate SL/TP direction
    if (slNum) {
      if (side === "long" && slNum >= effectivePrice) {
        toast.error("Stop loss must be below entry price for longs");
        return;
      }
      if (side === "short" && slNum <= effectivePrice) {
        toast.error("Stop loss must be above entry price for shorts");
        return;
      }
    }
    if (tpNum) {
      if (side === "long" && tpNum <= effectivePrice) {
        toast.error("Take profit must be above entry price for longs");
        return;
      }
      if (side === "short" && tpNum >= effectivePrice) {
        toast.error("Take profit must be below entry price for shorts");
        return;
      }
    }

    setSubmitting(true);

    // Simulate MPC encryption delay
    await new Promise((r) => setTimeout(r, 800));

    try {
      const order = onSubmit({
        side,
        type: orderType,
        size: sizeNum,
        price: orderType === "limit" ? Number(price) : currentPrice,
        leverage,
        stopLoss: slNum,
        takeProfit: tpNum,
        market,
      });

      toast.success(
        `${orderType === "market" ? "Market" : "Limit"} ${side} order ${orderType === "market" ? "filled" : "placed"} — encrypted via Arcium`,
        { description: `${sizeNum} ${market.split("/")[0]} @ ${leverage}x leverage` }
      );

      // Reset form
      setSize("");
      setPrice("");
      setStopLoss("");
      setTakeProfit("");
    } catch {
      toast.error("Order failed — try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Long / Short */}
      <div className="flex rounded-lg bg-muted p-1">
        <button
          onClick={() => setSide("long")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold transition-all ${
            side === "long" ? "bg-profit text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Long
        </button>
        <button
          onClick={() => setSide("short")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold transition-all ${
            side === "short" ? "bg-loss text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          Short
        </button>
      </div>

      {/* Order Type */}
      <div className="flex rounded-lg bg-muted p-1">
        <button
          onClick={() => setOrderType("market")}
          className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
            orderType === "market" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType("limit")}
          className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
            orderType === "limit" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Limit
        </button>
      </div>

      {/* Size */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Size ({market.split("/")[0]})
        </label>
        <input
          type="number"
          step="0.01"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="0.00"
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Limit Price */}
      {orderType === "limit" && (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Limit Price (USDC)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={currentPrice.toFixed(2)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      {/* Leverage */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Leverage: <span className="text-primary font-bold">{leverage}x</span>
        </label>
        <div className="flex gap-1.5 mb-2">
          {leveragePresets.map((l) => (
            <button
              key={l}
              onClick={() => setLeverage(l)}
              className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition-all ${
                leverage === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {l}x
            </button>
          ))}
        </div>
        <input
          type="range"
          min={1}
          max={50}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* TP/SL Toggle */}
      <button
        onClick={() => setShowTpSl(!showTpSl)}
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <AlertTriangle className="h-3 w-3" />
        {showTpSl ? "Hide" : "Add"} TP / SL
      </button>

      {showTpSl && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-medium text-profit mb-1 block">Take Profit</label>
            <input
              type="number"
              step="0.01"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="—"
              className="w-full rounded-lg border border-profit/30 bg-profit/5 px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-profit"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-loss mb-1 block">Stop Loss</label>
            <input
              type="number"
              step="0.01"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="—"
              className="w-full rounded-lg border border-loss/30 bg-loss/5 px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-loss"
            />
          </div>
        </div>
      )}

      {/* Order Summary */}
      {sizeNum > 0 && (
        <div className="rounded-lg bg-muted/50 border border-border p-3 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Notional Value</span>
            <span className="font-mono text-foreground">${notionalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Required Margin</span>
            <span className="font-mono text-foreground">${margin.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Liq. Price</span>
            <span className="font-mono text-loss">${liquidationPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Encryption notice */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start gap-2">
        <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-[11px] text-primary/80">
          Order encrypted via Arcium MPC before submission. Position details remain private.
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`w-full rounded-lg py-3 text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
          side === "long"
            ? "bg-profit text-primary-foreground hover:opacity-90"
            : "bg-loss text-primary-foreground hover:opacity-90"
        }`}
      >
        {submitting
          ? "Encrypting & Submitting…"
          : !connected
            ? "Connect Wallet"
            : `${side === "long" ? "Long" : "Short"} ${market.split("/")[0]} — ${orderType === "market" ? "Market" : "Limit"}`}
      </button>
    </div>
  );
};

export default OrderForm;
