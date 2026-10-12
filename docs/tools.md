# Tool reference — 18 read-only tools

Generated against the live server at `https://mcp.crowdintel.xyz/mcp` (2026-08-12). For exact parameter schemas, call `tools/list` with your token — the server's inline schemas are the source of truth.

## Wallets

| Tool | What it returns |
| --- | --- |
| `get_wallet_stats` | The flagship single-wallet dossier: overview, equity curve, open positions, PnL by market, biggest wins, category breakdown — assembled from ~1.88B indexed fills + pre-aggregated stats. Pull only the sections you need via `sections`. |
| `get_wallet_timing` | Entry-timing edge: does this wallet get in before the crowd and before the odds move? |
| `get_wallet_alerts` | Most recent insider-score alerts for a wallet, newest first, with score breakdowns. |
| `search_wallets` | Screen the leaderboard by min PnL and/or category, or free-text address/name lookup. |

## Markets

| Tool | What it returns |
| --- | --- |
| `get_market` | Market detail: outcomes, prices, volume, resolution state. |
| `get_market_alerts` | Flagged trades on one market. |
| `get_market_flow` | Smart-money vs crowd money flow delta on a market. |
| `get_market_movers` | Markets with the strongest recent smart-money movement. |
| `get_whale_activity` | Live feed of large trades. |

## Clusters

| Tool | What it returns |
| --- | --- |
| `get_cluster` | One funding cluster: members, funder, aggregate performance. |
| `find_funding_clusters` | Profitable funding clusters (possible coordinated groups / sybils). |

## Alpha discovery

| Tool | What it returns |
| --- | --- |
| `scan_insider_signals` | Recent high-suspicion trades across all markets (counter-consensus entries with corroboration). |
| `screen_wallets_by_edge` | Wallets with statistically real category-specific edge (shrinkage-adjusted, not raw win rate). |

## Cohorts

| Tool | What it returns |
| --- | --- |
| `list_cohorts` | Curated wallet cohorts (e.g. machine-speed accounts, category specialists). |
| `get_cohort` | Members + stats of one cohort. |

## Investigations

| Tool | What it returns |
| --- | --- |
| `get_investigation` | One curated anomaly write-up with its frozen evidence. |
| `list_investigations` | All published investigations. |

## Leaderboard

| Tool | What it returns |
| --- | --- |
| `get_leaderboard` | Ranked wallets by PnL, win rate, volume, or category metrics. |

## Auth & limits

Every tool answers on a **free** token (`cint_mcp_…`, minted at [Settings → API](https://crowdintel.xyz), no card). Daily call caps by plan: 20 free / 50 Pro / 300 Terminal / 1,500 Terminal Pro.
