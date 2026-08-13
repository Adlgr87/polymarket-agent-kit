# Claude Desktop

1. Sign in at [crowdintel.xyz](https://crowdintel.xyz) → **Settings → API** → mint an MCP token (`cint_mcp_…`). Free on every plan, no credit card.
2. Open your Claude Desktop config file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
3. Add the server:

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

4. Restart Claude Desktop. The CrowdIntel tools appear in the tool picker.

Try: *"Screen Polymarket wallets with a real edge in geopolitics, then pull the dossier on the strongest one."*

If your client doesn't support remote HTTP servers natively, use the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) shim — see [mcp-http-raw.md](mcp-http-raw.md).
