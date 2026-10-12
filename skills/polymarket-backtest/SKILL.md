---
name: polymarket-backtest
description: Backtest a Polymarket wallet-following or signal strategy against resolved markets before risking money. Use when asked to test a strategy, check if copying a wallet would have worked, measure a signal's hit rate, or run a historical simulation on prediction markets. Triggers on "backtest Polymarket", "would copying this have worked", "test my strategy", "historical performance", "signal hit rate", "simulate trading".
---

# Polymarket backtesting

Answers: **would this have made money on resolved markets, and is the sample
big enough to believe it?**

## Setup

Hosted backtests run server-side, so a strategy is a **detector-signal replay
spec**, not a local simulation and not a per-wallet copy loop. Free token (no
card) — mint at [crowdintel.xyz](https://crowdintel.xyz) → Settings → API
(`cint_mcp_…`).

REST (no MCP client needed):

```bash
# enqueue — replay insider signals inside the entry gate over a resolution window
curl -s -X POST https://crowdintel.xyz/api/v1/backtest/run \
  -H "Authorization: Bearer cint_mcp_YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "signal": "insider",
    "filters": { "min_score": 65, "min_odds": 0.05, "max_odds": 0.35,
                 "category": "politics", "min_bet_value": 5000 },
    "period":  { "from": "2025-01-01", "to": "2026-01-01" },
    "stake_rule": { "kind": "flat", "size": 100, "scale_by_score": false },
    "initial_capital": 10000
  }'

# poll
curl -s https://crowdintel.xyz/api/v1/backtest/JOB_ID \
  -H "Authorization: Bearer cint_mcp_YOUR_TOKEN_HERE"
```

Request fields (all optional, unknown fields 400): `signal`
(`whale` | `insider` | `all`), `filters` (`min_score`, `max_score`, `category`,
`min_odds`, `max_odds`, `min_bet_value`), `period` (`from`/`to` on **resolution
date**, span ≤ 1,095 days), `stake_rule` (`flat`/`fractional`), `fees`,
`initial_capital`. A `POST` returns a `job_id`; `GET /api/v1/backtest/{job_id}`
returns `status` (`queued`|`running`|`done`|`error`) and, when done, `result`
with `summary`, `equity_curve`, `trades` and `assumptions`. Read `assumptions`
before quoting numbers. Free tier: a small monthly run allowance; paid tiers
raise it (never a different dataset).

## The loop

1. **Define the replay precisely.** Which detector (`whale`, `insider`, `all`),
   which score band, which odds band, which category, which minimum bet size,
   which resolution window. "Follow smart money" is not a spec; the six filter
   fields above are.
2. **Guard against the sample.** Read the resolved-trade count in `result.summary`.
   Under ~30 resolved events the output is a direction, not a result — say so.
3. **Enqueue, then poll** `POST /backtest/run` → `GET /backtest/{job_id}`.
4. **Report `result.assumptions` verbatim-ish**, then the numbers: total return,
   win rate, mean PnL per dollar risked, max drawdown, best and worst trade.
   A backtest whose assumptions the reader cannot see is marketing, not evidence.

## What honest backtests account for

- **Entry price, not just direction.** The gate and `min_odds`/`max_odds` filters
  exist because a signal that only works at a price you could not get is not an
  edge. Quote the band you actually replayed.
- **Resolution, not mark-to-market.** The `period` window filters on resolution
  date, so every trade in the result settled. Do not add unresolved markets.
- **Survivorship.** Replaying a detector over resolved history is not the same as
  picking today's winners and testing them. State which one you did.
- **Ranking on win rate alone** finds 99%-win-rate noise and negative-PnL yield
  farmers. The `insider` detector is gated at 35¢ entry; that gate is the point.

## Output shape

- One-line verdict, then the numbers with their event count.
- The rule restated as it was actually tested.
- What the result does **not** cover (sample size, regime, liquidity).

## Boundaries

- Past performance on resolved markets is not a forecast.
- Read-only: this backtests, it does not trade and does not manage money.
- Never present a backtest as a recommendation to deploy capital.
