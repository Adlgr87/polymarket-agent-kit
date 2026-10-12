# Installing CrowdIntel in Cline

CrowdIntel is a **remote** MCP server (Streamable HTTP). There is nothing to
build, no container to run, and no package to install.

## 1. Get a token

Sign in at <https://crowdintel.xyz> → **Settings → API** → mint an MCP token
(`cint_mcp_…`). Free on every plan, no credit card.

## 2. Add the server

Cline → **MCP Servers** → **Remote Servers** → *Add*, and enter:

| Field | Value |
| --- | --- |
| Name | `crowdintel` |
| URL | `https://mcp.crowdintel.xyz/mcp` |
| Transport | Streamable HTTP |
| Header | `Authorization: Bearer cint_mcp_YOUR_TOKEN_HERE` |

Or add it to the Cline MCP settings JSON directly:

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

## 3. Verify

Ask Cline: *"Use CrowdIntel to list the 5 markets with the strongest smart-money
movement right now."* It should call `get_market_movers` and return markets with
their current prices.

## What it provides

Eighteen read-only tools over Polymarket data: wallet dossiers
(`get_wallet_stats`), entry timing (`get_wallet_timing`), insider alerts
(`get_wallet_alerts`), wallet search (`search_wallets`), markets and flow
(`get_market`, `get_market_alerts`, `get_market_flow`, `get_market_movers`,
`get_whale_activity`), clusters (`get_cluster`, `find_funding_clusters`), alpha
screening (`scan_insider_signals`, `screen_wallets_by_edge`), cohorts
(`list_cohorts`, `get_cohort`), leaderboard (`get_leaderboard`) and published
investigations (`list_investigations`, `get_investigation`).

Full parameter reference: [docs/tools.md](docs/tools.md).

## Requirements and limits

- Network access to `mcp.crowdintel.xyz` (HTTPS).
- A bearer token — the server returns `401` without one, by design.
- No local dependencies, no Docker, no database.
- **Read-only.** The server holds no custody and places no orders. Execute
  through Polymarket's own CLOB client.
- Free tier: 20 MCP calls/day; paid tiers raise the cap (never a different
  dataset).

Server card (for discovery): <https://mcp.crowdintel.xyz/.well-known/mcp.json>
