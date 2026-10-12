---
name: polymarket-whale-flow
description: Read smart-money flow on a live Polymarket market — which side the sharp money is on versus the crowd, what moved, and what whales just did. Use when asked who is buying a market, which side whales are on, what big trades just happened, which markets are moving, or to follow the smart money into a position. Triggers on "whales buying", "smart money Polymarket", "market flow", "who is betting on X", "movers", "large trades", "whale activity".
---

# Polymarket whale flow

Answers: **on this market, is the money moving the sharps' way or the crowd's,
and what did the big wallets just do?**

## Setup

Read-only MCP server, free token (no card) — mint at
[crowdintel.xyz](https://crowdintel.xyz) → Settings → API (`cint_mcp_…`):

```json
{
  "mcpServers": {
    "crowdintel": {
      "type": "http",
      "url": "https://mcp.crowdintel.xyz/mcp",
      "headers": { "Authorization": "Bearer cint_mcp_YOUR_TOKEN_HERE" }
    }
  }
}
```

Same data over REST at `https://crowdintel.xyz/api/v1/*` with the same header.

## The flow, in order

1. **`get_market_movers`** — where smart-money movement is strongest right now.
   Start here when the user has no market in mind.
2. **`get_market_flow`** — on one market, the smart-money vs crowd money delta.
   This is the core read: **the delta, not the volume.**
3. **`get_whale_activity`** — the live tape of large trades, for "what just happened".
4. **`get_market`** — outcomes, prices, volume and resolution state, so the flow
   has a price and a settlement attached.
5. **`get_market_alerts`** — the flagged trades on that market, with insider scores.

Confirm any conclusion about a *wallet* with `get_wallet_stats` before naming it
as sharp. Flow tells you the direction; the dossier tells you whether the wallet
behind it is skilled.

## Reading it honestly

- **Large ≠ informed.** A whale bet is notable, not suspicious, and not evidence
  of edge. Say "large", not "smart", unless the dossier says otherwise.
- **Smart-money delta is not a forecast.** It is where identified sharp wallets
  have already positioned. Markets can move against them.
- **Ignore infrastructure.** Flow from known market-maker or exchange-funded
  infrastructure is plumbing. Prefer wallets whose `trader_kind` is `human` or
  `maker` and whose category edge is statistically real.
- **Always attach the price.** "Sharps are buying Yes" is meaningless without the
  current price and the entry-depth tier those wallets got in at.

## Output shape

- The market, its live price and the flow delta, in one line.
- The 3–5 largest moves with wallet, side, size, entry price.
- Which side reads as sharp and *why* (dossier-backed), or "unproven" if not.
- What would falsify the read (e.g. the flow is one infra funder).

## Boundaries

- Read-only data. This skill never places an order and never tells the user to.
- Never present flow as a recommendation or a guarantee.
- Numbers carry provenance — quote them with their timestamp.
