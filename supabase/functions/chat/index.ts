import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are VeilX Assistant — a helpful guide for the VeilX Private Perpetuals DEX built on Solana with Arcium MPC privacy.

You help users navigate the app and understand its features. Keep answers concise and friendly. Use markdown formatting.

## App Pages & Features:

### Home (/)
The landing page with protocol overview, features, how-it-works section, and architecture diagram.

### Trade (/trade)
The main trading terminal:
- **Market Selector**: Switch between SOL-PERP, ETH-PERP, BTC-PERP, ARB-PERP markets
- **Price Chart**: Real-time prices streamed from Pyth Network via SSE
- **Order Form**: Place Market or Limit orders with 1x-50x leverage
- **Take Profit / Stop Loss**: Protect positions with TP/SL orders
- **Slippage Tolerance**: Configure max slippage (0.05% - 1%)
- **Orderbook**: Live encrypted depth with MPC-redacted sizes
- **Funding Rates**: Hourly funding rate display for all markets
- **Arcium MPC**: All orders are encrypted locally before submission — plaintext never leaves the browser

### Portfolio (/portfolio)
Dashboard for managing your account:
- **Margin Account**: View balances, deposit/withdraw USDC
- **Positions**: Track open positions with live PnL
- **Swap**: Convert between SOL and USDC via the on-chain AMM
- **Faucet**: Get test USDC on devnet (requires mint authority wallet)
- **Liquidation Dashboard**: Monitor position health with encrypted indicators
- **Order Matching**: Visualize how encrypted orders flow through Arcium MPC

### Docs (/docs)
Comprehensive documentation:
- Protocol overview, architecture, smart contracts
- Features guide, security model, protocol status

## Key Concepts:
- **Arcium MPC**: Multi-party computation that processes encrypted order data without revealing it
- **Pyth Network**: Oracle providing real-time price feeds
- **Encrypted Orders**: Orders are encrypted client-side using x25519 key exchange with the MXE
- **Cluster 456**: The devnet Arcium MPC cluster used by VeilX
- **USDC Margin**: All positions are collateralized in USDC

## Wallet:
Users need Phantom or Solflare wallet connected to Solana devnet to trade.

If users ask something outside the app's scope, politely redirect them to relevant app features.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
