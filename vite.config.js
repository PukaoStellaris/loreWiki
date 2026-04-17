import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const AUDIO_EXTS = /\.(mp3|opus|flac|ogg|wav|aac|m4a)$/i

// Scans public/music/ at dev/build time and exposes the file list
// as a virtual module so App.jsx doesn't need a manual file list.
function musicManifestPlugin() {
  const virtualId = 'virtual:music-manifest'
  const resolvedId = '\0' + virtualId

  return {
    name: 'music-manifest',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id === resolvedId) {
        const musicDir = path.resolve('public/music')
        let files = []
        try {
          files = fs.readdirSync(musicDir).filter(f => AUDIO_EXTS.test(f))
        } catch {}
        return `export const musicFiles = ${JSON.stringify(files)};`
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), musicManifestPlugin()],
  build: {
    rollupOptions: {
      input: {
        main:      path.resolve('index.html'),
        phantasma: path.resolve('phantasma/index.html'),
        divinity:  path.resolve('divinity/index.html'),
      },
    },
  },
})
