import { NostrPool, Relay } from '@nostrify/nostrify';

interface Env {
  ZAP_CACHE: KVNamespace;
}

interface NostrEvent {
  kind: number;
  pubkey: string;
  created_at: number;
  tags: string[][];
  content: string;
}

interface Supporter {
  pubkey: string;
  totalSats: number;
  latestAt: number;
}

const RHR_PUBKEY = 'f81611363554b64306467234d7396ec88455707633f54738f6c4683535098cd3';
const EXTRA_ZAP_RELAYS = [
  'wss://relay.primal.net',
  'wss://relay.damus.io',
  'wss://relay.ditto.pub',
  'wss://antiprimal.net',
];

function getZapSender(event: NostrEvent): string | null {
  const bigPTag = event.tags.find(([name]) => name === 'P')?.[1];
  if (bigPTag && /^[0-9a-f]{64}$/.test(bigPTag)) return bigPTag;
  const descriptionTag = event.tags.find(([name]) => name === 'description')?.[1];
  if (descriptionTag) {
    try {
      const zapRequest = JSON.parse(descriptionTag);
      if (zapRequest.pubkey && /^[0-9a-f]{64}$/.test(zapRequest.pubkey)) return zapRequest.pubkey;
    } catch { }
  }
  return null;
}

function getZapAmount(event: NostrEvent): number | null {
  const amountTag = event.tags.find(([name]) => name === 'amount')?.[1];
  if (amountTag) {
    const msats = Number.parseInt(amountTag, 10);
    if (msats > 0) return Math.floor(msats / 1000);
  }
  return null;
}

async function refreshZapCache(env: Env) {
  const pool = new NostrPool(EXTRA_ZAP_RELAYS.map(url => new Relay(url)));
  const events = await pool.query([{ kinds: [9735], '#p': [RHR_PUBKEY], limit: 500 }]);
  
  const map = new Map<string, { totalSats: number; latestAt: number }>();
  for (const event of events as unknown as NostrEvent[]) {
    const sender = getZapSender(event);
    if (!sender || sender === RHR_PUBKEY) continue;
    const sats = getZapAmount(event);
    if (!sats) continue;

    const existing = map.get(sender);
    if (existing) {
      existing.totalSats += sats;
      existing.latestAt = Math.max(existing.latestAt, event.created_at);
    } else {
      map.set(sender, { totalSats: sats, latestAt: event.created_at });
    }
  }

  const supporters: Supporter[] = Array.from(map.entries())
    .map(([pubkey, data]) => ({ pubkey, ...data }))
    .sort((a, b) => b.totalSats - a.totalSats);

  await env.ZAP_CACHE.put('top-supporters', JSON.stringify(supporters));
  await env.ZAP_CACHE.put('last-updated', Date.now().toString());
  
  await pool.close();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/top-supporters') {
      const cached = await env.ZAP_CACHE.get('top-supporters');
      if (cached) {
        return new Response(cached, {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      // Fallback: Refresh if empty
      await refreshZapCache(env);
      const freshlyCached = await env.ZAP_CACHE.get('top-supporters');
      return new Response(freshlyCached || '[]', {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Default: Asset serving fallback (via binding or static)
    return new Response('Not Found', { status: 404 });
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(refreshZapCache(env));
  },
};
