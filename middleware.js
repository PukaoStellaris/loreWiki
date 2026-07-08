import { rewrite, next } from '@vercel/functions';

// Only the root path needs checking — every other request (assets, JS
// chunks, the /osu-* proxies) should hit the filesystem/rewrites normally.
export const config = {
  matcher: '/',
};

const RENDER_HOST = 'render.violet-aegis.com';

export default function middleware(request) {
  const host = request.headers.get('host') || '';
  if (host === RENDER_HOST) {
    return rewrite(new URL('/osuRender/index.html', request.url));
  }
  return next();
}
