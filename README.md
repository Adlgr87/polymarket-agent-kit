# Polymarket Agent Kit

**Intelligence for Polymarket trading bots and AI agents** — scored wallets, insider signals, funding clusters, whale flow, and live market data over 1.7B+ indexed on-chain fills, delivered to your agent through MCP or REST.

The official [`Polymarket/agents`](https://github.com/Polymarket/agents) repo (3.7K★) was archived in May 2026 and no longer runs. This kit is a maintained, intelligence-first path for the same builders: connect your agent to the [CrowdIntel](https://crowdintel.xyz) MCP server for the *decision* side, and pair it with the official CLOB client for execution.

> **Read-only by design.** No custody, no order placement, no keys to your funds. Your agent decides with CrowdIntel data; it trades through [Polymarket's official CLOB API](https://docs.polymarket.com/). Not affiliated with Polymarket — see [DISCLAIMER](DISCLAIMER.md).

## 60-second quickstart (Claude Desktop)

1. Sign in at [crowdintel.xyz](https://crowdintel.xyz) → **Settings → API** → mint an MCP token (`cint_mcp_…`). Free on every plan, no credit card.
2. Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "crowdintel": {
      "type": "http",
      "url": "https://mcp.crowdintel.xyz/mcp",
      "headers": {
        "Authorization": "Bearer cint_mcp_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

3. Restart Claude Desktop. Ask: *"Which Polymarket wallets have real category edge in politics right now?"*

Cursor, Zed, and raw JSON-RPC setups: [quickstart/](quickstart/). Every endpoint also exists as plain REST — see the [API reference](https://crowdintel.xyz/api-docs) and the drop-in [AI context doc](https://crowdintel.xyz/docs/ai-context.md).

## What your agent gets — 19 read-only tools

| Group | Tools |
| --- | --- |
| Wallets | `get_wallet_stats` (flagship dossier), `get_wallet_timing` (entry-timing edge), `get_wallet_alerts` (insider scores), `search_wallets` |
| Markets | `get_market`, `get_market_alerts`, `get_market_flow` (smart-money vs crowd), `get_market_movers`, `get_whale_activity` |
| Clusters | `get_cluster`, `find_funding_clusters` |
| Alpha discovery | `scan_insider_signals`, `screen_wallets_by_edge` |
| Cohorts | `list_cohorts`, `get_cohort` |
| Investigations | `get_investigation`, `list_investigations` |
| Leaderboard & calibration | `get_leaderboard`, `get_calibration` (favorite-longshot bias) |

Full parameter reference: [docs/tools.md](docs/tools.md).

## Recipes — agent patterns that work

1. **Follow the smart money on a hot market** — `get_market_movers` → `get_market_flow` → `get_whale_activity`.
2. **Should my agent trust this wallet's signal?** — `search_wallets` → `get_wallet_stats` + `get_wallet_timing` + `get_wallet_alerts`. Raw win rates lie (small samples, wash trading, sybil clusters); the dossier ships shrinkage-adjusted stats.
3. **Find a coordinated ring before it resolves** — `scan_insider_signals` / `find_funding_clusters` → `get_cluster`.
4. **Category-specialist copy-trade screen** — `screen_wallets_by_edge` → `get_leaderboard`.

Each recipe ends where execution begins: hand the decision to the official CLOB client. This kit never places orders.

## Rate limits

Every tool answers on a free token; paid tiers raise the caps (see [pricing](https://crowdintel.xyz/pricing)). MCP daily calls: 20 free / 50 Pro / 300 Terminal / 1,500 Terminal Pro. REST: 50 req/hr free up to 5,000 req/hr Terminal Pro.

## Links

- [MCP server guide](https://crowdintel.xyz/mcp) · [API reference](https://crowdintel.xyz/api-docs) · [OpenAPI 3.1 spec](https://crowdintel.xyz/openapi.json)
- [AI context doc](https://crowdintel.xyz/docs/ai-context.md) — one file that teaches any LLM the whole API
- [Methodology](https://crowdintel.xyz/methodology) — how scores and stats are computed

## License

[MIT](LICENSE). Not affiliated with, endorsed by, or sponsored by Polymarket — see [DISCLAIMER](DISCLAIMER.md).
