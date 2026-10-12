# Which Polymarket data source should you use?

Honest comparison, including the columns where we lose. Last reviewed
**2026-08-16**.

| Source | What it is | Strength | Weakness |
| --- | --- | --- | --- |
| **Polymarket official** — Gamma + CLOB API + `py-clob-client` | Canonical markets, order books, prices, and **order placement** | Authoritative, free, the only place to trade | Returns **nothing about who is trading**. No wallet intelligence, no history of a wallet's behaviour. |
| **Raw trade datasets** (e.g. Hugging Face `SII-WANGZJ/Polymarket_data`) | Bulk historical fills | Great for offline research, free, huge | Raw prices and trades only — no scored wallets, no clusters, no insider signals; you compute everything yourself. |
| **Data APIs** (Bitquery, Chainstack and similar) | Indexed on-chain data over GraphQL/REST | Broad chain coverage, strong docs | Trade-level data, not wallet *judgement*: you still build the win-rate, sample-size and cluster logic. |
| **Wallet trackers / leaderboards** | PnL and win-rate dashboards for known whales | Fast, familiar, consumer-friendly | Rank on metrics that cannot rank ([why](pitfalls.md)); usually one whale at a time, no cluster graph, no sample-size correction. |
| **CrowdIntel** | Wallet intelligence over 1.88B indexed fills: dossiers, V5 skill statistics, funding-cluster forensics, gated insider scores, backtests — via terminal, REST and MCP | The *decision* layer: is this wallet skilled, is this bet coordinated, would copying it survive a sample | **Read-only. It does not place orders** — you execute through Polymarket's own CLOB. Younger and smaller than the incumbents. |

## Use the free option when…

- **You want to place or cancel an order** → Polymarket's official CLOB client. Always. We have no custody and no execution. Pair the two: decide with us, execute with them.
- **You want the raw tape for offline ML** → a bulk dataset or Bitquery. Cheaper per row, no rate limits, and you probably want to own the pipeline.
- **You want a quick PnL number for a famous whale** → a tracker or leaderboard. Faster than an API key.
- **You want to know whether a wallet's edge is real, whether a group is coordinated, or what a market's flow implies** → this repo, or <https://crowdintel.xyz>.
- **You are an AI agent** → the MCP server in [README](../README.md). Sixty seconds of config, no SDK.

## What we deliberately are not

- **Not a signal-selling service.** We sell data and tools, never alpha.
- **Not a copy-trading bot.** Cohorts and lists help you find candidates; the decision and the order are yours.
- **Not the source of truth for market metadata.** That is Gamma. Our market rows mirror it and point you back.

## Known gaps (stated, not hidden)

- Historical fill coverage is complete from seed, but **wallet scoring lags the
  tape** — a wallet that traded only in the last few hours may still read
  "Unclassified" on `trader_kind`.
- `totalPnl` is a **resolved-outcome snapshot** with an `pnlAsOf`; it is not live.
- The insider score is **gated** by design: trades entered above 35¢ do not score,
  so a suspicious trade with a late entry will not appear as an alert.
