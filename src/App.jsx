import { useState, useRef, useEffect, useCallback } from "react";
import { musicFiles } from "virtual:music-manifest";

// =============================================================================
// CONFIGURATION — Edit these to set up your library
// =============================================================================

// Path to your background video (place in your public/ folder)
// Set to null to use the animated gradient fallback
const BG_VIDEO_PATH = "/videos/background.mp4";

// Path to your logo/icon image (place in your public/ folder)
// Set to null to use the default music note icon as fallback
const LOGO_IMAGE_PATH = "/Icon.png";

// Rotating tips/descriptions shown on the home page
// Each tip displays for a few seconds before fading to the next
const HOME_TIPS = [
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
const TIP_DURATION_SECONDS = 30;


// Music folder base path (place your audio files in public/music/)
const MUSIC_FOLDER = "/music/";

// Optional metadata overrides for files in public/music/.
// The app auto-scans the folder — you don't need to list files here.
// Only add an entry if you want to customize the title or artist.
//
// Fields:  file (required), title, artist (optional)
const LIBRARY_OVERRIDES = [
  // Examples — customize these with your actual files:
  // { file: "porter_robinson_-_get_your_wish.mp3", title: "Get Your Wish", artist: "Porter Robinson" },
  // { file: "rick_astley_-_never_gonna_give_you_up.mp3", title: "Never Gonna Give You Up", artist: "Rick Astley" },
  // { file: "daft_punk_-_digital_love.flac", title: "Digital Love", artist: "Daft Punk" },
  //
  // Files in /music/ without an entry here will auto-appear with
  // their filename as the title and "Unknown Artist" as artist.
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

// =============================================================================

// Builds the library from the scanned file list.
// Files with a matching entry in LIBRARY_OVERRIDES get custom title/artist.
// Everything else gets its title auto-generated from the filename.
function buildLibrary() {
  const overrideMap = {};
  LIBRARY_OVERRIDES.forEach(o => { overrideMap[o.file] = o; });

  return musicFiles.map((file, i) => {
    const override = overrideMap[file] || {};
    const cleanName = file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    return {
      id: i + 1,
      title: override.title || cleanName,
      artist: override.artist || "Unknown Artist",
      duration: 0,
      url: `${MUSIC_FOLDER}${file}`,
      file,
    };
  });
}

const LIBRARY_SONGS = buildLibrary();

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// --- Theme colors ---
const ACCENT = "#c4b5fd";
const ACCENT_HOVER = "#a78bfa";
const ACCENT_DEEP = "#7c3aed";
const BG_MAIN = "#0c0a1a";
const BG_PANEL = "#110e24";
const BORDER = "#1e1a3a";
const TEXT = "#e8e4f0";
const TEXT_DIM = "#6b6394";
const TEXT_MUTED = "#3d3660";

// --- Icons ---
const Icon = ({ name, size = 20 }) => {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle" };
  const icons = {
    home: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    search: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    play: <svg style={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    pause: <svg style={s} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    skipBack: <svg style={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="2"/></svg>,
    skipFwd: <svg style={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="2"/></svg>,
    shuffle: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>,
    repeat: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
    volume: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>,
    volumeMute: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>,
    heart: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartFill: <svg style={s} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    music: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    list: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    upload: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    folder: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    chevron: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  };
  return icons[name] || null;
};

// --- Color gen for album art ---
const artColors = ["#c4b5fd","#f9a8d4","#93c5fd","#fcd34d","#6ee7b7","#fca5a5","#a78bfa","#67e8f9"];
const getColor = (id) => artColors[id % artColors.length];

// --- Fake album art ---
const AlbumArt = ({ song, size = 48 }) => {
  const bg = getColor(song.id);
  const bg2 = artColors[(song.id + 3) % artColors.length];
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: 6,
      background: `linear-gradient(135deg, ${bg}44, ${bg2}66)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: `1px solid ${bg}33`, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", width: size * 0.6, height: size * 0.6,
        borderRadius: "50%", background: `${bg}22`,
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        border: `2px solid ${bg}44`,
      }}/>
      <Icon name="music" size={size * 0.35} />
    </div>
  );
};

// --- Logo with image fallback ---
// Renders its own container. Background disappears once the image loads.
// When loaded successfully, renders the bare image with no container effects.
const LogoIcon = ({ size = 32, radius = 8 }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef(null);

  // Handle already-cached images that fire onLoad before React sees it
  useEffect(() => {
    if (imgRef.current?.complete && !imgRef.current.naturalWidth === 0) {
      setImgLoaded(true);
    }
  }, []);

  if (LOGO_IMAGE_PATH && !imgFailed) {
    return (
      <div style={{
        width: size, height: size, borderRadius: radius, overflow: "hidden", flexShrink: 0,
        background: imgLoaded ? "transparent" : `linear-gradient(135deg, ${ACCENT_DEEP}, ${ACCENT})`,
        transition: "background 0.3s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <img
          ref={imgRef}
          src={LOGO_IMAGE_PATH}
          alt="Logo"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgFailed(true)}
          style={{
            width: size, height: size, objectFit: "contain", borderRadius: radius,
            opacity: imgLoaded ? 1 : 0, transition: "opacity 0.3s",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(135deg, ${ACCENT_DEEP}, ${ACCENT})`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon name="music" size={size * 0.55} />
    </div>
  );
};

// --- Main App ---
export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(new Set());
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("home");
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const progressRef = useRef(null);

  const allSongs = [...LIBRARY_SONGS, ...uploadedSongs];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => {
      if (repeatMode === 2) { audio.currentTime = 0; audio.play(); }
      else skipTrack(1);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => { audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("ended", onEnd); };
  }, [repeatMode, currentSong]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.preservesPitch = false;
      audioRef.current.mozPreservesPitch = false;
      audioRef.current.webkitPreservesPitch = false;
    }
  }, [playbackRate]);

  // Rotating tips on home page
  useEffect(() => {
    if (HOME_TIPS.length <= 1) return;
    const interval = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % HOME_TIPS.length);
        setTipVisible(true);
      }, 500);
    }, TIP_DURATION_SECONDS * 1000);
    return () => clearInterval(interval);
  }, []);

  const playSong = useCallback((song) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = song.url;
    audio.volume = isMuted ? 0 : volume;
    // Persist playback rate across song changes
    audio.playbackRate = playbackRate;
    audio.preservesPitch = false;
    audio.mozPreservesPitch = false;
    audio.webkitPreservesPitch = false;
    setCurrentSong(song);
    setCurrentTime(0);
    setIsPlaying(true);
    audio.play().catch(() => {});
  }, [volume, isMuted, playbackRate]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  };

  const skipTrack = (dir) => {
    if (!currentSong) return;
    const list = filteredSongs.length ? filteredSongs : allSongs;
    const idx = list.findIndex(s => s.id === currentSong.id);
    let next;
    if (shuffle) {
      next = list[Math.floor(Math.random() * list.length)];
    } else {
      const ni = (idx + dir + list.length) % list.length;
      next = list[ni];
    }
    if (next) playSong(next);
  };

  const seekTo = (e) => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const dur = audioRef.current.duration;
    if (dur && isFinite(dur)) {
      audio.currentTime = pct * dur;
      setCurrentTime(audio.currentTime);
    }
  };

  const handleFiles = (files) => {
    const audioFiles = Array.from(files).filter(f => f.type.startsWith("audio/"));
    const newSongs = audioFiles.map((f, i) => {
      const url = URL.createObjectURL(f);
      const name = f.name.replace(/\.[^/.]+$/, "");
      return {
        id: 10000 + uploadedSongs.length + i,
        title: name, artist: "Local File",
        duration: 0, url,
      };
    });
    setUploadedSongs(prev => [...prev, ...newSongs]);
    if (newSongs.length && !currentSong) playSong(newSongs[0]);
  };

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); };
  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const filteredSongs = allSongs.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLike = (id) => setLiked(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const getDuration = () => {
    if (!currentSong) return 0;
    if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) return audioRef.current.duration;
    return currentSong.duration || 0;
  };

  const progress = getDuration() > 0 ? (currentTime / getDuration()) * 100 : 0;

  return (
    <div style={{
      width: "100%", height: "100vh", display: "flex", flexDirection: "column",
      background: BG_MAIN, color: TEXT, fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      fontSize: 14, overflow: "hidden", position: "relative",
    }}
      onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #2d2856; }
        input[type="range"] { -webkit-appearance: none; background: transparent; cursor: pointer; }
        input[type="range"]::-webkit-slider-runnable-track { height: 4px; background: ${BORDER}; border-radius: 2px; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%;
          background: ${ACCENT}; margin-top: -5px; box-shadow: 0 0 8px ${ACCENT}66;
        }
        .song-row { transition: background 0.15s; cursor: pointer; }
        .song-row:hover { background: #ffffff06 !important; }
        .song-row:hover .row-play { opacity: 1 !important; }
        .sidebar-item { transition: all 0.15s; cursor: pointer; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; gap: 12px; }
        .sidebar-item:hover { background: #ffffff08; }
        .sidebar-item.active { background: ${ACCENT_DEEP}18; color: ${ACCENT}; }
        .ctrl-btn { background: none; border: none; color: ${TEXT_DIM}; cursor: pointer; padding: 8px; border-radius: 50%; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
        .ctrl-btn:hover { color: ${TEXT}; background: #ffffff08; }
        .ctrl-btn.active { color: ${ACCENT}; }
        .ctrl-btn.play-main { background: ${ACCENT}; color: ${BG_MAIN}; width: 42px; height: 42px; }
        .ctrl-btn.play-main:hover { background: ${ACCENT_HOVER}; transform: scale(1.05); }
        .drop-overlay {
          position: absolute; inset: 0; z-index: 100; background: ${BG_MAIN}ee;
          display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px;
          border: 3px dashed ${ACCENT}44; border-radius: 12px; pointer-events: none;
        }
        .progress-bar { position: relative; height: 4px; background: ${BORDER}; border-radius: 2px; cursor: pointer; flex: 1; }
        .progress-bar:hover { height: 6px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, ${ACCENT_DEEP}, ${ACCENT}); border-radius: 2px; transition: width 0.1s linear; position: relative; }
        .progress-fill::after {
          content: ''; position: absolute; right: -6px; top: 50%; transform: translateY(-50%);
          width: 12px; height: 12px; border-radius: 50%; background: ${ACCENT};
          box-shadow: 0 0 10px ${ACCENT}66; opacity: 0; transition: opacity 0.15s;
        }
        .progress-bar:hover .progress-fill::after { opacity: 1; }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .speed-menu { position: absolute; bottom: 100%; right: 0; margin-bottom: 8px; background: #1a1535; border: 1px solid ${BORDER}; border-radius: 10px; padding: 6px; min-width: 80px; z-index: 50; box-shadow: 0 8px 32px #00000066; }
        .speed-opt { display: block; width: 100%; background: none; border: none; color: ${TEXT_DIM}; padding: 7px 14px; font-size: 13px; cursor: pointer; border-radius: 6px; text-align: center; font-family: 'Space Mono', monospace; transition: all 0.1s; }
        .speed-opt:hover { background: #ffffff08; color: ${TEXT}; }
        .speed-opt.active { color: ${ACCENT}; background: ${ACCENT_DEEP}18; }
      `}</style>

      <audio ref={audioRef} preload="auto" />

      {dragOver && (
        <div className="drop-overlay">
          <Icon name="upload" size={48} />
          <span style={{ color: ACCENT, fontSize: 18, fontWeight: 600 }}>Drop audio files here</span>
        </div>
      )}

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{
            width: 240, minWidth: 240, background: BG_PANEL, borderRight: `1px solid ${BORDER}`,
            display: "flex", flexDirection: "column", padding: "16px 12px", gap: 4, overflowY: "auto",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 14px 20px",
              borderBottom: `1px solid ${BORDER}`, marginBottom: 8,
            }}>
              <LogoIcon size={32} radius={8} />
              <span style={{ fontSize: 17, fontWeight: 700, color: ACCENT, letterSpacing: "-0.02em" }}>
                Violet Aegis
              </span>
            </div>

            <div className={`sidebar-item ${activeView === "home" ? "active" : ""}`} onClick={() => setActiveView("home")}>
              <Icon name="home" size={18} /> <span>Home</span>
            </div>
            <div className={`sidebar-item ${activeView === "library" ? "active" : ""}`} onClick={() => setActiveView("library")}>
              <Icon name="music" size={18} /> <span>Library</span>
            </div>
            <div className={`sidebar-item ${activeView === "search" ? "active" : ""}`} onClick={() => setActiveView("search")}>
              <Icon name="search" size={18} /> <span>Search</span>
            </div>
            <div className={`sidebar-item ${activeView === "favorites" ? "active" : ""}`} onClick={() => setActiveView("favorites")}>
              <Icon name="heart" size={18} /> <span>Favorites</span>
            </div>
            <div className={`sidebar-item ${activeView === "upload" ? "active" : ""}`} onClick={() => setActiveView("upload")}>
              <Icon name="upload" size={18} /> <span>Upload</span>
            </div>

            {uploadedSongs.length > 0 && (
              <>
                <div style={{ padding: "16px 14px 6px", fontSize: 11, fontWeight: 600, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Uploaded
                </div>
                {uploadedSongs.map(s => (
                  <div key={s.id} className="sidebar-item" onClick={() => playSong(s)}
                    style={{ fontSize: 13, color: currentSong?.id === s.id ? ACCENT : TEXT_DIM }}>
                    <Icon name="music" size={14} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
                  </div>
                ))}
              </>
            )}

            <div style={{ flex: 1 }} />
            <div style={{ padding: "12px 14px", fontSize: 11, color: TEXT_MUTED }}>
              Drop audio files anywhere to add them
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top bar */}
          <div style={{
            padding: "16px 28px", display: "flex", alignItems: "center", gap: 16,
            borderBottom: `1px solid ${BORDER}`,
          }}>
            <button className="ctrl-btn" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginRight: 4 }}>
              <Icon name="list" size={20} />
            </button>
            <div style={{ flex: 1, maxWidth: 480, position: "relative", display: "flex", alignItems: "center" }}>
              <Icon name="search" size={16} />
              <input
                type="text" placeholder="Search songs or artists..."
                value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setActiveView("search"); }}
                onFocus={() => setActiveView("search")}
                style={{
                  background: "transparent", border: "none", outline: "none", color: TEXT,
                  fontSize: 14, padding: "8px 12px", flex: 1, fontFamily: "inherit",
                }}
              />
              {searchQuery && (
                <button className="ctrl-btn" onClick={() => setSearchQuery("")} style={{ padding: 4 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>×</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="audio/*" multiple style={{ display: "none" }}
              onChange={e => handleFiles(e.target.files)} />
            <button className="ctrl-btn" onClick={() => fileInputRef.current?.click()}
              style={{ gap: 6, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", fontSize: 13 }}>
              <Icon name="upload" size={16} /> <span>Upload</span>
            </button>
          </div>


          {/* Content area — all views stay mounted, toggled via display to keep video alive */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

            {/* ====== HOME ====== */}
            <div style={{
              position: "absolute", inset: 0, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: activeView === "home" ? 1 : 0,
              visibility: activeView === "home" ? "visible" : "hidden",
              transition: "opacity 0.6s ease",
            }}>
              {BG_VIDEO_PATH ? (
                <video src={BG_VIDEO_PATH} autoPlay loop muted playsInline
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
              ) : (
                <div style={{
                  position: "absolute", inset: 0, zIndex: 0,
                  background: `linear-gradient(135deg, ${BG_MAIN} 0%, #1a0e3a 30%, #120a2a 50%, #1e1040 70%, ${BG_MAIN} 100%)`,
                  backgroundSize: "400% 400%", animation: "gradientShift 12s ease infinite",
                }} />
              )}
              <div style={{
                position: "absolute", inset: 0, zIndex: 1,
                background: BG_VIDEO_PATH
                  ? `radial-gradient(ellipse at center, ${BG_MAIN}66 0%, ${BG_MAIN}cc 70%, ${BG_MAIN}ee 100%)`
                  : "transparent",
              }} />
              <div style={{
                position: "relative", zIndex: 2, textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
              }}>
                <LogoIcon size={88} radius={22} />
                <h1 style={{
                  fontSize: 52, fontWeight: 700, color: "#ffffff",
                  letterSpacing: "-0.03em", lineHeight: 1.1,
                  fontFamily: "'DM Sans', sans-serif",
                  textShadow: "0 0 10px #000000cc, 0 0 30px #000000aa, 0 2px 4px #000000ee, 0 0 60px #00000066",
                }}>
                  Violet Aegis
                </h1>
                <div style={{ position: "relative", minHeight: 52, maxWidth: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{
                    fontSize: 16, color: "#d4d0e0", maxWidth: 400,
                    lineHeight: 1.6, fontWeight: 400,
                    textShadow: "0 0 8px #000000cc, 0 0 20px #000000aa, 0 1px 3px #000000ee",
                    opacity: tipVisible ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                  }}>
                    {HOME_TIPS[tipIndex]}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button onClick={() => setActiveView("library")}
                    style={{
                      background: ACCENT, color: BG_MAIN, border: "none", borderRadius: 10,
                      padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                      fontFamily: "inherit", transition: "all 0.2s", boxShadow: `0 0 20px ${ACCENT}33`,
                    }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  >
                    Browse Library
                  </button>
                </div>
              </div>
            </div>

            {/* ====== UPLOAD ====== */}
            <div style={{
              position: "absolute", inset: 0, overflowY: "auto",
              display: activeView === "upload" ? "flex" : "none",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 20, color: TEXT_DIM,
            }}>
              <div style={{
                width: 200, height: 200, border: `2px dashed ${BORDER}`, borderRadius: 16,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 12, cursor: "pointer", transition: "border-color 0.2s",
              }} onClick={() => fileInputRef.current?.click()}>
                <Icon name="upload" size={40} />
                <span style={{ fontSize: 15, fontWeight: 500 }}>Click or drag files</span>
                <span style={{ fontSize: 12 }}>MP3, WAV, FLAC, OGG</span>
              </div>
            </div>

            {/* ====== LIBRARY / SEARCH / FAVORITES ====== */}
            <div style={{
              position: "absolute", inset: 0, overflowY: "auto", padding: "8px 0",
              display: activeView !== "home" && activeView !== "upload" ? "block" : "none",
            }}>
              <div style={{ padding: "12px 28px", fontSize: 13, color: TEXT_DIM, display: "flex", alignItems: "center" }}>
                <span style={{ flex: 1 }}>
                  {activeView === "favorites" ? "Favorites" : "Songs"} — {
                    (activeView === "favorites" ? filteredSongs.filter(s => liked.has(s.id)) : filteredSongs).length
                  } tracks
                </span>
              </div>

              <div style={{
                display: "grid", gridTemplateColumns: "48px 1fr 70px 40px",
                padding: "6px 28px", fontSize: 11, color: TEXT_MUTED, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${BORDER}22`,
              }}>
                <span></span><span>Title</span><span style={{ textAlign: "right" }}>Time</span>
                <span></span>
              </div>

              {(activeView === "favorites" ? filteredSongs.filter(s => liked.has(s.id)) : filteredSongs).map((song) => (
                <div key={song.id} className="song-row"
                  style={{
                    display: "grid", gridTemplateColumns: "48px 1fr 70px 40px",
                    padding: "10px 28px", alignItems: "center",
                    background: currentSong?.id === song.id ? `${ACCENT_DEEP}0c` : "transparent",
                  }}
                  onClick={() => playSong(song)}
                >
                  <div style={{ position: "relative" }}>
                    <AlbumArt song={song} size={40} />
                    <div className="row-play" style={{
                      position: "absolute", inset: 0, display: "flex", alignItems: "center",
                      justifyContent: "center", background: "#0008", borderRadius: 6, opacity: 0,
                    }}>
                      <Icon name={currentSong?.id === song.id && isPlaying ? "pause" : "play"} size={16} />
                    </div>
                  </div>
                  <div style={{ minWidth: 0, paddingLeft: 12 }}>
                    <div style={{
                      fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      color: currentSong?.id === song.id ? ACCENT : TEXT,
                    }}>{song.title}</div>
                    <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2 }}>{song.artist}</div>
                  </div>
                  <span style={{ textAlign: "right", color: TEXT_DIM, fontSize: 13, fontFamily: "'Space Mono', monospace" }}>
                    {fmt(song.duration)}
                  </span>
                  <button className="ctrl-btn" style={{ padding: 4 }}
                    onClick={e => { e.stopPropagation(); toggleLike(song.id); }}>
                    <Icon name={liked.has(song.id) ? "heartFill" : "heart"} size={16} />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Now Playing Bar */}
      <div style={{
        height: 80, minHeight: 80, background: BG_PANEL, borderTop: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", padding: "0 20px", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, width: 260, minWidth: 200 }}>
          {currentSong ? (
            <>
              <AlbumArt song={currentSong} size={50} />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap", color: TEXT,
                }}>{currentSong.title}</div>
                <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2 }}>{currentSong.artist}</div>
              </div>
              <button className="ctrl-btn" style={{ padding: 4, flexShrink: 0 }}
                onClick={() => toggleLike(currentSong.id)}>
                <span style={{ color: liked.has(currentSong.id) ? ACCENT : TEXT_DIM }}>
                  <Icon name={liked.has(currentSong.id) ? "heartFill" : "heart"} size={18} />
                </span>
              </button>
            </>
          ) : (
            <div style={{ color: TEXT_MUTED, fontSize: 13 }}>No track selected</div>
          )}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className={`ctrl-btn ${shuffle ? "active" : ""}`} onClick={() => setShuffle(!shuffle)}>
              <Icon name="shuffle" size={16} />
            </button>
            <button className="ctrl-btn" onClick={() => skipTrack(-1)}>
              <Icon name="skipBack" size={18} />
            </button>
            <button className="ctrl-btn play-main" onClick={togglePlay}>
              <Icon name={isPlaying ? "pause" : "play"} size={20} />
            </button>
            <button className="ctrl-btn" onClick={() => skipTrack(1)}>
              <Icon name="skipFwd" size={18} />
            </button>
            <button className={`ctrl-btn ${repeatMode > 0 ? "active" : ""}`}
              onClick={() => setRepeatMode((repeatMode + 1) % 3)}
              style={{ position: "relative" }}>
              <Icon name="repeat" size={16} />
              {repeatMode === 2 && (
                <span style={{
                  position: "absolute", bottom: 2, right: 2, fontSize: 8, fontWeight: 700,
                  color: ACCENT, lineHeight: 1,
                }}>1</span>
              )}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 600 }}>
            <span style={{ fontSize: 11, color: TEXT_DIM, fontFamily: "'Space Mono', monospace", minWidth: 36, textAlign: "right" }}>
              {fmt(currentTime)}
            </span>
            <div className="progress-bar" ref={progressRef} onClick={seekTo}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: 11, color: TEXT_DIM, fontFamily: "'Space Mono', monospace", minWidth: 36 }}>
              {fmt(getDuration())}
            </span>
          </div>
        </div>

        {/* Speed & Volume */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
          <div style={{ position: "relative" }}>
            <button
              className={`ctrl-btn ${playbackRate !== 1.0 ? "active" : ""}`}
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              style={{
                padding: "4px 8px", borderRadius: 6, fontSize: 12,
                fontFamily: "'Space Mono', monospace", fontWeight: 700,
                minWidth: 42, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowSpeedMenu(false)} />
                <div className="speed-menu">
                  {[0.75, 0.8, 0.9, 1.0, 1.1, 1.2, 1.25, 1.5].map(r => (
                    <button key={r}
                      className={`speed-opt ${playbackRate === r ? "active" : ""}`}
                      onClick={() => { setPlaybackRate(r); setShowSpeedMenu(false); }}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="ctrl-btn" onClick={() => setIsMuted(!isMuted)} style={{ padding: 4 }}>
            <Icon name={isMuted || volume === 0 ? "volumeMute" : "volume"} size={18} />
          </button>
          <input
            type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume}
            onChange={e => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
            style={{ width: 90 }}
          />
        </div>
      </div>
    </div>
  );
}
