import { useState } from "react";
import { ACCENT, BG_PANEL, BORDER, TEXT_MUTED } from "../../lib/player/config";
import Icon from "./Icon";
import LogoIcon from "./LogoIcon";

const VIEWS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "library", label: "Library", icon: "music" },
  { id: "search", label: "Search", icon: "search" },
  { id: "favorites", label: "Favorites", icon: "heart" },
  { id: "upload", label: "Upload", icon: "upload" },
];

export function Sidebar({ view, onSelectView, playlists, onCreatePlaylist, onDeletePlaylist, uploadCount }) {
  const [naming, setNaming] = useState(false);
  const [draft, setDraft] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (draft.trim()) onCreatePlaylist(draft);
    setDraft("");
    setNaming(false);
  };

  return (
    <nav
      aria-label="Sections"
      style={{
        width: 240, minWidth: 240, background: BG_PANEL, borderRight: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column", padding: "16px 12px", gap: 2, overflowY: "auto",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "8px 14px 20px",
        borderBottom: `1px solid ${BORDER}`, marginBottom: 8,
      }}>
        <LogoIcon size={32} radius={8} />
        <span style={{ fontSize: 17, fontWeight: 700, color: ACCENT, letterSpacing: "-0.02em" }}>
          Violet Aegis
        </span>
      </div>

      {VIEWS.map(item => (
        <button
          key={item.id}
          className={`sidebar-item${view.type === item.id ? " active" : ""}`}
          aria-current={view.type === item.id ? "page" : undefined}
          onClick={() => onSelectView({ type: item.id })}
        >
          <Icon name={item.icon} size={18} />
          <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
          {item.id === "upload" && uploadCount > 0 && (
            <span style={{ fontSize: 11, color: TEXT_MUTED }}>{uploadCount}</span>
          )}
        </button>
      ))}

      <div style={{
        padding: "18px 14px 6px", fontSize: 11, fontWeight: 600, color: TEXT_MUTED,
        textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center",
      }}>
        <span style={{ flex: 1 }}>Playlists</span>
        <button className="ctrl-btn" onClick={() => setNaming(true)} aria-label="New playlist" style={{ padding: 2 }}>
          <Icon name="plus" size={14} />
        </button>
      </div>

      {naming && (
        <form onSubmit={submit} style={{ padding: "2px 6px 6px" }}>
          <input
            autoFocus
            className="text-input"
            value={draft}
            placeholder="Playlist name"
            aria-label="New playlist name"
            onChange={e => setDraft(e.target.value)}
            onBlur={submit}
            onKeyDown={e => { if (e.key === "Escape") { setDraft(""); setNaming(false); } }}
          />
        </form>
      )}

      {playlists.length === 0 && !naming && (
        <p style={{ padding: "2px 14px 8px", fontSize: 11, color: TEXT_MUTED, lineHeight: 1.5 }}>
          None yet — use a track's menu to start one.
        </p>
      )}

      {playlists.map(p => (
        <div key={p.id} className="sidebar-row">
          <button
            className={`sidebar-item${view.type === "playlist" && view.id === p.id ? " active" : ""}`}
            aria-current={view.type === "playlist" && view.id === p.id ? "page" : undefined}
            onClick={() => onSelectView({ type: "playlist", id: p.id })}
            style={{ flex: 1, minWidth: 0 }}
          >
            <Icon name="playlist" size={16} />
            <span className="row-title" style={{ flex: 1, textAlign: "left", fontSize: 13 }}>{p.name}</span>
            <span style={{ fontSize: 11, color: TEXT_MUTED }}>{p.songIds.length}</span>
          </button>
          <button
            className="ctrl-btn sidebar-delete"
            onClick={() => onDeletePlaylist(p.id, p.name)}
            aria-label={`Delete playlist ${p.name}`}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      ))}

      <div style={{ flex: 1, minHeight: 12 }} />
      <p style={{ padding: "12px 14px", fontSize: 11, color: TEXT_MUTED, lineHeight: 1.5 }}>
        Drop audio files anywhere to add them.
      </p>
    </nav>
  );
}

export default Sidebar;
