# Violet Aegis

Personal site for **Project Divinity / Violet Aegis** — an animated landing hub that opens into a music player, a lore wiki, and per-character pages. Live at [violet-aegis.com](https://www.violet-aegis.com), hosted on Vercel.

## Architecture

This is a Vite **multi-page app**, not a SPA. Each section is its own HTML entry point with its own React root, wired up in `vite.config.js` (`rollupOptions.input`):

| URL | Entry HTML | React root |
|---|---|---|
| `/` | `index.html` | `src/VioletAegisHub.jsx` |
| `/listen` | `listen/index.html` | `src/App.jsx` (music player) |
| `/divinity` | `divinity/index.html` | `src/pages/wikiPage.jsx` (lore wiki) |
| `/phantasma` | `phantasma/index.html` | `src/pages/PhantasmaPage.jsx` |
| `/livvy` | `livvy/index.html` | `src/pages/LivvyPage.jsx` |
| `/jenny` | `jenny/index.html` | `src/pages/JennyPage.jsx` |
| `/white` | `white/index.html` | `src/pages/WhitePage.jsx` |

Clean URLs are handled by rewrites in `vercel.json` (production) and the `devRewrites` plugin in `vite.config.js` (dev server).

Shared UI lives in `src/components/` (`CharacterSplashPage`, `SoundButton`), `src/hooks/` (`useTipRotation`, `useRevealOnHover`), and `src/styles/character-page.css`. Lore data for the wiki is in `src/data/`.

## Commands

```sh
npm run dev       # dev server with clean-URL rewrites
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # eslint
```

## Music library

The player's track list comes from `virtual:music-manifest`, a virtual module produced by `musicManifestPlugin` in `vite.config.js`. It scans `public/music/` at build/dev time, so **dropping a new `.opus`/audio file into `public/music/` is all it takes** for the player to pick it up.

**Note:** `public/music/` is in `.gitignore` to keep the repo from growing further (the existing tracks remain tracked). A newly added track must be force-added or it won't deploy:

```sh
git add -f public/music/"New Track.opus"
```

## Assets

Large page backgrounds are served as WebP (`public/images/*.webp`). If you add a big PNG background, convert it first — e.g. with [sharp](https://sharp.pixelplumbing.com/):

```js
sharp("in.png").resize({ width: 2560, withoutEnlargement: true }).webp({ quality: 82 }).toFile("out.webp")
```

The social-preview image is `public/images/og-cover.jpg` (1200×630), referenced by the `og:image`/`twitter:image` tags in `index.html` and `listen/index.html`.
