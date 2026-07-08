import { rewrite, next } from '@vercel/functions';

// Root path (host-based routing) plus the cover/preview asset proxies —
// those two were behaving strangely as plain vercel.json external rewrites
// (both returning an identical unrelated placeholder for every beatmap ID,
// while the /osu-api rewrite worked fine with the same pattern), so they're
// proxied explicitly here instead, where the outbound fetch is fully ours.
export const config = {
  matcher: ['/', '/osu-cover/:path*', '/osu-preview/:path*'],
};

const RENDER_HOST = 'render.violet-aegis.com';
const UPSTREAMS = {
  '/osu-cover/': 'https://assets.ppy.sh/',
  '/osu-preview/': 'https://b.ppy.sh/preview/',
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const host = request.headers.get('host') || '';

  if (url.pathname === '/' && host === RENDER_HOST) {
    return rewrite(new URL('/osuRender/index.html', request.url));
  }

  for (const [prefix, upstreamBase] of Object.entries(UPSTREAMS)) {
    if (url.pathname.startsWith(prefix)) {
      return proxyAsset(upstreamBase + url.pathname.slice(prefix.length), request);
    }
  }

  return next();
}

async function proxyAsset(targetUrl, request) {
  const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; violet-aegis-osu-render/1.0)' };
  const range = request.headers.get('range');
  if (range) headers.Range = range; // let audio seeking pass through

  const upstream = await fetch(targetUrl, { headers });
  const outHeaders = new Headers();
  for (const key of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
    const v = upstream.headers.get(key);
    if (v) outHeaders.set(key, v);
  }
  outHeaders.set('cache-control', 'public, max-age=86400');
  outHeaders.set('access-control-allow-origin', '*');

  return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
}
