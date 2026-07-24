import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { parseFile } from 'music-metadata'

const AUDIO_EXTS = /\.(mp3|opus|flac|ogg|wav|aac|m4a)$/i

const MUSIC_DIR = path.resolve('public/music')
// Covers land in public/ so Vite serves them in dev and copies them to dist on
// build with no extra middleware. Generated — gitignored.
const COVER_DIR = path.resolve('public/music-covers')
const COVER_URL_BASE = '/music-covers'
const CACHE_FILE = path.resolve('node_modules/.cache/violet-aegis/music-manifest.json')

const PIC_EXT = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }

const sha1 = (input) => crypto.createHash('sha1').update(input).digest('hex')

// Stable per-track identity: derived from the filename, so adding or removing
// other tracks never renumbers anything. Liked songs and saved sessions key
// off this, so it must not depend on directory order.
const trackId = (file) => sha1(file).slice(0, 12)

function readCache() {
  try { return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) } catch { return {} }
}

function writeCache(cache) {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true })
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache))
  } catch { /* cache is an optimisation; failing to persist it is survivable */ }
}

// Writes an embedded cover to public/music-covers/ keyed by its content hash, so
// tracks that share album art share one file. Returns the public URL.
function writeCover(picture) {
  const ext = PIC_EXT[String(picture.format).toLowerCase()] || 'jpg'
  const name = `${sha1(picture.data)}.${ext}`
  const dest = path.join(COVER_DIR, name)
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(COVER_DIR, { recursive: true })
    fs.writeFileSync(dest, picture.data)
  }
  return `${COVER_URL_BASE}/${name}`
}

async function readTrack(file) {
  const full = path.join(MUSIC_DIR, file)
  // `duration: true` lets music-metadata fall back to scanning when the container
  // header has no duration — Ogg/Opus in particular store it on the final page.
  const { common, format } = await parseFile(full, { duration: true })
  return {
    title: common.title || null,
    artist: common.artist || common.albumartist || null,
    album: common.album || null,
    duration: Number.isFinite(format.duration) ? format.duration : 0,
    cover: common.picture?.length ? writeCover(common.picture[0]) : null,
  }
}

// Removes cover files no longer referenced by any track, so renaming or deleting
// music doesn't leave orphans accumulating in public/.
function pruneCovers(tracks) {
  let existing
  try { existing = fs.readdirSync(COVER_DIR) } catch { return }
  const live = new Set(tracks.map(t => t.cover && path.basename(t.cover)).filter(Boolean))
  for (const name of existing) {
    if (!live.has(name)) {
      try { fs.unlinkSync(path.join(COVER_DIR, name)) } catch { /* ignore */ }
    }
  }
}

async function buildManifest(log) {
  let files = []
  try {
    files = fs.readdirSync(MUSIC_DIR).filter(f => AUDIO_EXTS.test(f))
  } catch {
    return []
  }

  const cache = readCache()
  const next = {}
  const tracks = []
  let parsed = 0

  for (const [index, file] of files.entries()) {
    const full = path.join(MUSIC_DIR, file)
    let stat
    try { stat = fs.statSync(full) } catch { continue }

    // Re-read only when the file itself changed, or when a previous run produced
    // a cover that has since been pruned away.
    const hit = cache[file]
    const coverPresent = !hit?.cover || fs.existsSync(path.join(COVER_DIR, path.basename(hit.cover)))
    let meta
    if (hit && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size && coverPresent) {
      meta = hit
    } else {
      try {
        meta = { ...(await readTrack(file)), mtimeMs: stat.mtimeMs, size: stat.size }
        parsed++
      } catch (err) {
        log?.(`could not read tags from ${file}: ${err.message}`)
        meta = { title: null, artist: null, album: null, duration: 0, cover: null, mtimeMs: stat.mtimeMs, size: stat.size }
      }
    }

    next[file] = meta
    tracks.push({
      id: trackId(file),
      // Index in directory order, matching the id scheme this player used before
      // stable ids existed. Kept only so saved likes can be migrated once.
      legacyId: index + 1,
      file,
      url: `/music/${encodeURIComponent(file)}`,
      title: meta.title,
      artist: meta.artist,
      album: meta.album,
      duration: meta.duration,
      cover: meta.cover,
    })
  }

  writeCache(next)
  pruneCovers(tracks)
  if (parsed) log?.(`indexed ${parsed} of ${tracks.length} track${tracks.length === 1 ? '' : 's'}`)
  return tracks
}

// Scans public/music/ at dev/build time and exposes the full track list —
// tags, duration and extracted cover art included — as a virtual module.
// Doing this here means the client ships a ready-made library instead of
// issuing two network requests per track to discover the same information.
export default function musicManifestPlugin() {
  const virtualId = 'virtual:music-manifest'
  const resolvedId = '\0' + virtualId

  let tracks = []
  let server = null

  const log = (msg) => console.log(`  \x1b[35m[music]\x1b[0m ${msg}`)

  return {
    name: 'music-manifest',

    async buildStart() {
      tracks = await buildManifest(log)
    },

    resolveId(id) {
      if (id === virtualId) return resolvedId
    },

    load(id) {
      if (id === resolvedId) {
        return `export const musicTracks = ${JSON.stringify(tracks)};`
      }
    },

    configureServer(_server) {
      server = _server
      // Re-index and hot-reload the library when audio files are added or removed.
      const refresh = async (file) => {
        if (!AUDIO_EXTS.test(file) || !file.startsWith(MUSIC_DIR)) return
        tracks = await buildManifest(log)
        const mod = server.moduleGraph.getModuleById(resolvedId)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
          server.ws.send({ type: 'full-reload' })
        }
      }
      server.watcher.add(MUSIC_DIR)
      server.watcher.on('add', refresh)
      server.watcher.on('unlink', refresh)
    },
  }
}
