// =============================================================================
// CONFIGURATION — Edit these to set up your library
// =============================================================================

// Path to your background video (place in your public/ folder)
// Set to null to use the animated gradient fallback
export const BG_VIDEO_PATH = "/videos/background.mp4";

// Path to your logo/icon image (place in your public/ folder)
// Set to null to use the default music note icon as fallback
export const LOGO_IMAGE_PATH = "/Icon.png";

// Rotating tips/descriptions shown on the home page
// Each tip displays for a few seconds before fading to the next
export const HOME_TIPS = [
  "The shuffle button exists. Use it. Surprises are good for you. I would know. — Mirai",
  "You can adjust the playback speed. I don't know why you would, but the option is there. Options are important. — Stellium",
  "The repeat button has three states — off, repeat all, repeat one. I've been on repeat one for six hours. I regret nothing. — Vesta",
  "You can search by mood, genre, or artist. I searched 'songs for when your Archon won't stop humming at her desk.' Zero results. Disappointing. — Anemos",
  "I've had the same song on loop for four days. Stellium took my headphones. I found new headphones. — Vesta",
  "Volume at maximum is not always the answer. I say this from experience. Structural experience. — Stellium",
  "Someone added a very dramatic orchestral piece to the shared queue. I'm not saying it was me. I'm also not saying it wasn't. — Sentinel",
  "I made Sentinel a playlist. She said she'd listen to it 'eventually.' That was two months ago. The playlist is still there, Sentinel. — Anemos",
];

// How many seconds each tip stays visible before transitioning
export const TIP_DURATION_SECONDS = 30;

// Optional metadata overrides for files in public/music/.
// Titles, artists, durations and cover art are read straight from each file's
// tags at build time — you don't need to list anything here.
// Only add an entry when the embedded tags are wrong or ugly.
//
// Fields:  file (required), title, artist (optional)
export const LIBRARY_OVERRIDES = [
  { file: "I Really Want To Stay At Your House ⧸ Eurobeat Remix.opus",
    title: "I Really Want To Stay At Your House ⧸ Eurobeat Remix",
    artist: "Turbo" },
  { file: "HYURURIRAPAPPA.opus",
    title: "HYURURIRAPAPPA",
    artist: "tuki." },
  { file: "Bao The Whale - 'Queen' Kanaria (Cover).opus",
    title: "Queen",
    artist: "Bao The Whale & Kanaria" },
  { file: "フォニイ（phony）┃Cover by Raon Lee.opus",
    title: "フォニイ（phony）",
    artist: "Raon Lee" },
  { file: "Senbonzakura (English Cover) 【JubyPhonic】千本桜.opus",
    title: "Senbonzakura (English Cover)",
    artist: "JubyPhonic" },
  { file: "Override (English Cover)「オーバーライド」【Will Stetson】.opus",
    title: "「オーバーライド」",
    artist: "Will Stetson" },
  { file: "Tobu & Jim Yosef - Miracle (Original Mix).opus",
    title: "Miracle",
    artist: "Tobu & Jim Yosef" },
];

// Playback speeds offered in the speed menu
export const SPEED_OPTIONS = [0.75, 0.8, 0.9, 1.0, 1.1, 1.2, 1.25, 1.5, 2.0];

// Seconds to jump when seeking with the arrow keys or media-key seek buttons
export const SEEK_STEP_SECONDS = 5;

// Below this width the player collapses to the now-playing bar on its own
export const MINI_PLAYER_BREAKPOINT = 520;

// =============================================================================

// --- Theme colors ---
export const ACCENT = "#c4b5fd";
export const ACCENT_HOVER = "#a78bfa";
export const ACCENT_DEEP = "#7c3aed";
export const BG_MAIN = "#0c0a1a";
export const BG_PANEL = "#110e24";
export const BORDER = "#1e1a3a";
export const TEXT = "#e8e4f0";
export const TEXT_DIM = "#6b6394";
export const TEXT_MUTED = "#3d3660";
