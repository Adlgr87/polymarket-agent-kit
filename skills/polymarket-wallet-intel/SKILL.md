---
name: polymarket-wallet-intel
description: Vet a Polymarket wallet before you copy, follow, or fade it. Use when asked whether a wallet is skilled, whether its win rate is real, if it is a bot or a human, what its worst trade looks like, or to pull a full wallet dossier — returns resolved-outcome PnL, shrinkage-adjusted win rate, V5 skill statistics, entry-timing edge and category edge from CrowdIntel's MCP server. Triggers on "is this Polymarket wallet good", "check this wallet", "0x… win rate", "should I copy this trader", "wallet dossier", "whale analysis".
---

# Polymarket wallet intelligence

Answer one question: **is this wallet's edge real, and would it survive copying?**
Raw win rate cannot answer that — a 90% win rate on eight bets is noise, and a
wallet that wins 99.86% of its positions at 99.6¢ can still finish negative.
This skill uses the statistics that can: EV-per-dollar lower bound, event-clustered
z-scores, false-discovery-rate q-values and one bot/human/maker verdict.

## Setup

Read-only MCP server, free token (no card). Mint at
[crowdintel.xyz](https://crowdintel.xyz) → Settings → API (`cint_mcp_…`), then:

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

No MCP client? The same data is plain REST at
`https://crowdintel.xyz/api/v1/wallets/{address}` with the same Bearer header.

## The three calls, in order

1. **`search_wallets`** — find the wallet (address, Polymarket name, or screen the
   leaderboard by category and minimum PnL). Never guess an address.
2. **`get_wallet_stats`** — the dossier. Pull only the sections you need:
   `overview`, `equity_curve`, `open_positions`, `pnl_by_market`, `biggest_wins`,
   `categories`. The overview carries `bayesianWinRate`, `totalPnl`, `pnlSource`
   and `pnlAsOf`.
3. **`get_wallet_timing`** + **`get_wallet_alerts`** — did it get in before the
   crowd and before the odds moved, and do its scored trades cluster in time?

Then decide with `screen_wallets_by_edge` when the question is category edge
rather than a single wallet.

## How to read the numbers

| Field | Read it as |
| --- | --- |
| `bayesianWinRate` | Win rate shrunk toward the base rate by sample size. The only win rate worth quoting. |
| `totalPnl` + `pnlSource` + `pnlAsOf` | Resolved-outcome PnL, with its provenance and timestamp. Quote `pnlAsOf`; it is not live. |
| `trader_kind` | One verdict — `human`, `bot`, `maker`, `unknown` — with `trader_kind_evidence`. A NULL verdict is "Unclassified", never "human". |
| insider score | **Per-alert, not per-wallet.** Call `get_wallet_alerts`. Gated: a trade only scores if it entered at 35¢ or below. |
| `fundingClusterSize` / `fundingFunderIsInfra` | If the funder is known exchange/infra infrastructure, a big cluster means shared plumbing, not collusion. |

**Ranking rule:** sort on EV-per-dollar lower bound or skill q-value. Win rate
may *filter* a board; it may never *sort* one. Do not present a raw win rate as
the reason to copy anyone.

## Output shape

- **Verdict first** — "real edge", "noise", or "unproven", with the stat that decided it.
- The stat and the sample behind it (effective n, not raw trade count).
- The counter-case: the biggest loss, the category it loses in, the bot verdict.
- Residual uncertainty, in one line, with `pnlAsOf`.

## Boundaries

- CrowdIntel is **read-only**: it cannot place orders, hold funds, or copy-trade
  for the user. Execution is the user's call through their own venue.
- Report data; never call it a recommendation. "Skilled by these measures", not
  "buy this".
- If a stat is missing, say it is missing. Do not infer PnL from bet values.
