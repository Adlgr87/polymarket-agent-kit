/**
 * Register a webhook and print every insider signal as it arrives.
 *
 * CrowdIntel pushes scored alerts to you instead of making your bot poll. The
 * callback URL must be https and publicly routable. Delivered events carry the
 * insider score; the gate (entry at 35c or below) has already been applied, so
 * a delivery is a scored event, never a raw large trade — see docs/metrics.md.
 *
 *   export CROWDINTEL_TOKEN=cint_...      # free key: crowdintel.xyz -> Settings -> API
 *   npx tsx alert_webhook.ts
 *
 * Node 18+ (uses global fetch). No dependencies.
 */

import { createServer } from 'node:http';
import { once } from 'node:events';

const TOKEN = process.env.CROWDINTEL_TOKEN;
if (!TOKEN) {
    throw new Error('set CROWDINTEL_TOKEN (mint a free key at crowdintel.xyz -> Settings -> API)');
}

const PORT = Number(process.env.PORT ?? 8788);
const CALLBACK_URL = process.env.CALLBACK_URL ?? `https://your-host.example.com/hooks/crowdintel`;
const API = 'https://crowdintel.xyz/api/v1';

const auth = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

// 1. Receive. Verify the shared secret before trusting anything.
const server = createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/hooks/crowdintel') {
        res.writeHead(404).end();
        return;
    }
    const body = JSON.parse(await readAll(req));
    const { market_title, wallet, side, entry_price, insider_score, reasons } = body;
    console.log(
        `[${insider_score}] ${wallet} bought ${side} @ ${entry_price} — ${market_title}` +
            (reasons?.length ? `\n    because: ${reasons.join(', ')}` : ''),
    );
    res.writeHead(202).end();
});

// 2. Register the callback. Only a floor and a kind are required to start.
const res = await fetch(`${API}/webhooks`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
        callback_url: CALLBACK_URL,
        score_type: 'insider',
        min_score: 65,
    }),
});
if (!res.ok) throw new Error(`webhook create failed: ${res.status} ${await res.text()}`);
const { id, secret } = await res.json();
console.log(`registered webhook ${id} -> ${CALLBACK_URL} (signing secret: ${secret ? 'issued' : 'none'})`);

server.listen(PORT);
await once(server, 'listening');
console.log(`listening for deliveries on :${PORT} — Ctrl-C to stop`);

function readAll(req: import('node:http').IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (c) => (data += c));
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });
}
