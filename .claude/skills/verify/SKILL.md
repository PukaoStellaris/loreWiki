---
name: verify
description: Build, run, and drive the Violet Aegis site end-to-end to verify changes at the browser surface.
---

# Verifying Violet Aegis changes

## Build / launch

- `npm run dev` → Vite dev server at http://localhost:5173 (run in background).
- `npm run build` for a production smoke check. `npm run lint` has **pre-existing failures** (App.jsx, VioletAegisHub.jsx, vite.config.js, wikiPage.jsx `Icon` no-unused-vars quirk) — lint only the files you touched and compare against `git show HEAD:<file> | npx eslint --stdin --stdin-filename <file>` to separate new errors from baseline.

## Drive (browser)

No Playwright browsers are installed. Use **playwright-core + system Edge** (no download):

1. In the session scratchpad: `npm init -y && npm i playwright-core`
2. `chromium.launch({ channel: "msedge", headless: true })`
3. Write driver scripts to files — **never inline `node -e` from PowerShell** (`$(...)` and quotes get mangled).

## Site specifics

- `/divinity` (wiki) and `/story` (reader) are gated by a client-side password: `ACCESS_PASSWORD` in `src/lib/authConfig.js`. Fill `input[type="password"]`, click `button[type="submit"]`. Auth is sessionStorage **per tab** and shared between the two pages — a tab that unlocked /divinity is already unlocked on /story, so make unlock conditional on the input existing.
- It's an MPA: navigate with real `page.goto` between sections (`/`, `/listen`, `/divinity`, `/story`, `/phantasma`, …).
- The wiki syncs state to `location.hash` (`#/characters/astral-anemos`) — deep links and goBack are testable.
- Reader persistence lives in localStorage keys `story_reader_progress`, `story_reader_settings`, `story_read_chapters`, `story_reader_bookmarks`.
- Lucide icons are inline SVGs — `article svg` matches them, not your chart. Select charts by viewBox, e.g. `svg[viewBox="0 0 480 480"]` (relationship graph), `svg[viewBox="0 0 1000 620"]` (world map).
- Measure reader typography on `main p.indent-8` (a real chapter paragraph); the first `main p` is a UI label.

## Gotcha

`position: sticky` does not work inside `<main class="overflow-x-hidden">` (both pages) — sticky elements silently stay static. Use `fixed` for always-reachable controls.
