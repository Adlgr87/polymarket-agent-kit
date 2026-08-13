# Raw HTTP / any MCP client

The server speaks **Streamable HTTP** JSON-RPC at `https://mcp.crowdintel.xyz/mcp` with a Bearer token. Anything that can POST JSON can use it — no SDK required.

List the tools:

```bash
curl -s https://mcp.crowdintel.xyz/mcp \
  -H "Authorization: Bearer cint_mcp_YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Call a tool:

```bash
curl -s https://mcp.crowdintel.xyz/mcp \
  -H "Authorization: Bearer cint_mcp_YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_market_movers","arguments":{}}}'
```

For stdio-only MCP clients, bridge with [`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

```json
{
  "mcpServers": {
    "crowdintel": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.crowdintel.xyz/mcp",
               "--header", "Authorization: Bearer cint_mcp_YOUR_TOKEN_HERE"]
    }
  }
}
```

Prefer plain REST? The same data is served at `https://crowdintel.xyz/api/v1/*` — [reference](https://crowdintel.xyz/api-docs), [OpenAPI spec](https://crowdintel.xyz/openapi.json).
