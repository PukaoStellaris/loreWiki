import { useCallback, useEffect, useRef, useState } from "react";

const newId = () =>
  `up-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}`;

// Reads the length straight off the element when the file's tags don't carry
// one, which is common for wav and for anything re-encoded without a header.
function probeDuration(url) {
  return new Promise(resolve => {
    const audio = new Audio();
    audio.preload = "metadata";
    const done = (value) => { audio.src = ""; resolve(value); };
    audio.onloadedmetadata = () => done(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.onerror = () => done(0);
    audio.src = url;
  });
}

/**
 * Locally added files.
 *
 * Every blob and every extracted cover is an object URL, and object URLs are
 * held by the document until they're explicitly revoked — so this hook owns the
 * full lifetime of both and releases them on removal and on unmount.
 */
export function useUploads() {
  const [songs, setSongs] = useState([]);
  const urlsRef = useRef(new Map());

  const track = (id, url) => {
    const existing = urlsRef.current.get(id) ?? [];
    urlsRef.current.set(id, [...existing, url]);
  };

  const release = useCallback((id) => {
    for (const url of urlsRef.current.get(id) ?? []) URL.revokeObjectURL(url);
    urlsRef.current.delete(id);
  }, []);

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      for (const list of urls.values()) list.forEach(URL.revokeObjectURL);
      urls.clear();
    };
  }, []);

  const add = useCallback(async (files) => {
    const audioFiles = Array.from(files ?? []).filter(
      f => f.type.startsWith("audio/") || /\.(mp3|opus|flac|ogg|wav|aac|m4a)$/i.test(f.name)
    );
    if (!audioFiles.length) return [];

    const created = audioFiles.map(file => {
      const id = newId();
      const url = URL.createObjectURL(file);
      track(id, url);
      return {
        id,
        file: file.name,
        url,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Local file",
        album: null,
        duration: 0,
        cover: null,
        isUpload: true,
      };
    });

    setSongs(prev => [...prev, ...created]);

    // music-metadata is a large dependency and only uploads need it in the
    // browser — the library's tags were read at build time. Loading it here
    // keeps it out of the initial bundle entirely.
    const { parseBlob } = await import("music-metadata");

    await Promise.all(created.map(async (song, i) => {
      const patch = {};
      try {
        const { common, format } = await parseBlob(audioFiles[i]);
        if (common.title) patch.title = common.title;
        if (common.artist) patch.artist = common.artist;
        if (common.album) patch.album = common.album;
        if (Number.isFinite(format.duration)) patch.duration = format.duration;
        if (common.picture?.length) {
          const pic = common.picture[0];
          const coverUrl = URL.createObjectURL(new Blob([pic.data], { type: pic.format }));
          track(song.id, coverUrl);
          patch.cover = coverUrl;
        }
      } catch { /* unreadable tags are not worth surfacing — the file still plays */ }

      if (!patch.duration) patch.duration = await probeDuration(song.url);

      setSongs(prev => prev.map(s => (s.id === song.id ? { ...s, ...patch } : s)));
    }));

    return created;
  }, []);

  const remove = useCallback((id) => {
    setSongs(prev => prev.filter(s => s.id !== id));
    release(id);
  }, [release]);

  return { songs, add, remove };
}
