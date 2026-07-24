import { useCallback, useEffect, useState } from "react";
import { KEYS, readJSON, writeJSON } from "../lib/player/storage";

const newId = () =>
  (crypto.randomUUID?.() ?? `pl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

// User-made playlists, stored as ordered lists of track ids. Because ids are
// derived from filenames rather than directory position, a playlist survives
// adding and removing other music.
export function usePlaylists() {
  const [playlists, setPlaylists] = useState(() => {
    const saved = readJSON(KEYS.playlists, []);
    return Array.isArray(saved) ? saved.filter(p => p?.id && Array.isArray(p.songIds)) : [];
  });

  useEffect(() => { writeJSON(KEYS.playlists, playlists); }, [playlists]);

  const create = useCallback((name, songs = []) => {
    const playlist = {
      id: newId(),
      name: name.trim() || "Untitled playlist",
      songIds: songs.map(s => s.id),
      createdAt: Date.now(),
    };
    setPlaylists(prev => [...prev, playlist]);
    return playlist;
  }, []);

  const rename = useCallback((id, name) => {
    setPlaylists(prev => prev.map(p => (p.id === id ? { ...p, name: name.trim() || p.name } : p)));
  }, []);

  const remove = useCallback((id) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  }, []);

  // Adding an existing track is a no-op rather than a duplicate — a playlist is
  // a set of songs, and silently doubling one up reads as a bug.
  const addSongs = useCallback((id, songs) => {
    const ids = (Array.isArray(songs) ? songs : [songs]).map(s => s.id);
    setPlaylists(prev => prev.map(p => {
      if (p.id !== id) return p;
      const fresh = ids.filter(songId => !p.songIds.includes(songId));
      return fresh.length ? { ...p, songIds: [...p.songIds, ...fresh] } : p;
    }));
  }, []);

  const removeSong = useCallback((id, songId) => {
    setPlaylists(prev => prev.map(p => (
      p.id === id ? { ...p, songIds: p.songIds.filter(s => s !== songId) } : p
    )));
  }, []);

  const reorder = useCallback((id, from, to) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id !== id) return p;
      const songIds = p.songIds.slice();
      const [moved] = songIds.splice(from, 1);
      if (moved === undefined) return p;
      songIds.splice(to, 0, moved);
      return { ...p, songIds };
    }));
  }, []);

  return { playlists, create, rename, remove, addSongs, removeSong, reorder };
}
