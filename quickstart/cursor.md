# Cursor

1. Sign in at [crowdintel.xyz](https://crowdintel.xyz) → **Settings → API** → mint an MCP token (`cint_mcp_…`). Free on every plan, no credit card.
2. Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "crowdintel": {
      "url": "https://mcp.crowdintel.xyz/mcp",
      "headers": {
        "Authorization": "Bearer cint_mcp_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

3. Reload Cursor. Ask the agent to `get_market_movers` on today's most active markets, or wire the tools into your own agent loop.

Zed and other MCP-capable editors use the same URL + Bearer header in their own config format.
