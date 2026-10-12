---
name: polymarket-sybil-clusters
description: Detect coordinated Polymarket wallets — funding clusters, sybil rings and same-side timing clusters — before a market resolves. Use when asked whether several wallets are connected, if a group is betting together, who funded this wallet, whether a pump is coordinated, or to find suspicious clusters and insider-shaped trades. Triggers on "sybil", "coordinated wallets", "funding cluster", "who funded this wallet", "insider trading Polymarket", "suspicious wallets", "same time bets".
---

# Polymarket sybil & cluster detection

Answers: **are these wallets one actor, and does the group's behaviour look like
it knew something?**

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

REST equivalents: `/api/v1/clusters/sybil`, `/api/v1/clusters/{funder}/graph`,
`/api/v1/clusters/by-id/{id}`.

## Two kinds of cluster — do not confuse them

| Kind | What it is | Tool |
| --- | --- | --- |
| **Funding cluster** | Wallets funded from the same USDC source. Structural, persistent. | `find_funding_clusters`, `get_cluster` |
| **Time cluster** | Wallets that took the same side of the same market inside a short window. Behavioural, per-market. | `get_market_alerts` on one market |

A funding cluster is a *relationship*, not a verdict: Polymarket's own
infrastructure funds tens of thousands of wallets from a handful of addresses.
Always check whether the funder is infrastructure before calling a cluster
coordinated.

## The flow, in order

1. **`scan_insider_signals`** — recent counter-consensus entries with
   corroboration across all markets. The top-of-funnel call.
2. **`find_funding_clusters`** — profitable funding clusters worth a look.
3. **`get_cluster`** — members, funder, sizes, aggregate performance for one cluster.
4. **`list_investigations`** → **`get_investigation`** — published write-ups with
   frozen evidence and p-values. Cite these instead of re-deriving.

For a wallet the user names: `get_wallet_stats` returns `fundingClusterSize` and
`fundingFunderIsInfra`; the dossier's connections view walks the funder graph.

## Judging a cluster

- **Size alone is not suspicion.** A 100+ wallet cluster from a known infra
  funder is plumbing and scores *down*, not up.
- **The informative case** is a small cluster of unknown proxies with real
  category edge and synchronous counter-consensus entries.
- **State the corroboration.** A flagged trade needs a second signal — wallet
  skill or a concentrated first bet — unless entry was under 10¢.
- **Insider score is gated on entry price** (35¢ or below) and is per-alert, not
  per-wallet.

## Output shape

- Cluster first: size, funder, infrastructure yes/no, aggregate PnL.
- The evidence that makes it interesting, or the reason it is boring.
- Named members with their dossier verdicts (`trader_kind`, category edge).
- Confidence and what would change the read.

## Boundaries

- **Name behaviour, not people.** "Coordinated counter-consensus entries from a
  shared funder", never "these people are insider trading" — that is a legal
  conclusion this data cannot support.
- Research output. Not investment advice, not an accusation.
- Read-only; no execution surface.
