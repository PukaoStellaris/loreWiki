import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import musicManifestPlugin from './plugins/music-manifest.js'

// Mirrors vercel.json rewrites so clean URLs work in dev too
function devRewrites() {
  const map = {
    '/listen':    '/listen/index.html',
    '/phantasma': '/phantasma/index.html',
    '/divinity':  '/divinity/index.html',
    '/livvy':     '/livvy/index.html',
    '/jenny':     '/jenny/index.html',
    '/white':     '/white/index.html',
    '/story':     '/story/index.html',
    '/chat':      '/chat/index.html',
    '/osuRender': '/osuRender/index.html',
  };
  return {
    name: 'dev-rewrites',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (map[req.url]) req.url = map[req.url];
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), musicManifestPlugin(), devRewrites()],
  // Same-origin proxies for the osu! render page — mirrors the external
  // rewrites in vercel.json so covers/previews stay CORS-clean in dev too.
  server: {
    proxy: {
      '/osu-api':     { target: 'https://catboy.best',  changeOrigin: true, rewrite: p => p.replace(/^\/osu-api/, '/api') },
      '/osu-preview': { target: 'https://b.ppy.sh',     changeOrigin: true, rewrite: p => p.replace(/^\/osu-preview/, '/preview') },
      '/osu-cover':   { target: 'https://assets.ppy.sh', changeOrigin: true, rewrite: p => p.replace(/^\/osu-cover/, '') },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main:      path.resolve('index.html'),
        listen:    path.resolve('listen/index.html'),
        phantasma: path.resolve('phantasma/index.html'),
        divinity:  path.resolve('divinity/index.html'),
        livvy:     path.resolve('livvy/index.html'),
        jenny:     path.resolve('jenny/index.html'),
        white:     path.resolve('white/index.html'),
        story:     path.resolve('story/index.html'),
        chat:      path.resolve('chat/index.html'),
        osuRender: path.resolve('osuRender/index.html'),
      },
    },
  },
})
