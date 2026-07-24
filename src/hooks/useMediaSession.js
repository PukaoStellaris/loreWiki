import { useEffect } from "react";
import { SEEK_STEP_SECONDS } from "../lib/player/config";

// Publishes the current track to the OS so hardware media keys, the lock screen
// and headphone buttons control playback, and the notification shows real
// artwork instead of the tab favicon.
export function useMediaSession(player) {
  const { currentSong, isPlaying, duration, toggle, next, prev, seek, seekBy, subscribeTime } = player;

  useEffect(() => {
    const ms = navigator.mediaSession;
    if (!ms) return;

    if (!currentSong) {
      ms.metadata = null;
      ms.playbackState = "none";
      return;
    }

    ms.metadata = new window.MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      album: currentSong.album || "Violet Aegis",
      artwork: currentSong.cover
        ? [{ src: currentSong.cover, sizes: "512x512", type: "image/jpeg" }]
        : [{ src: "/Icon.png", sizes: "512x512", type: "image/png" }],
    });
  }, [currentSong]);

  useEffect(() => {
    const ms = navigator.mediaSession;
    if (ms) ms.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  useEffect(() => {
    const ms = navigator.mediaSession;
    if (!ms?.setActionHandler) return;

    const handlers = {
      play: () => toggle(),
      pause: () => toggle(),
      previoustrack: () => prev(),
      nexttrack: () => next(),
      seekbackward: (d) => seekBy(-(d.seekOffset || SEEK_STEP_SECONDS)),
      seekforward: (d) => seekBy(d.seekOffset || SEEK_STEP_SECONDS),
      seekto: (d) => seek(d.seekTime),
    };

    const attached = [];
    for (const [action, handler] of Object.entries(handlers)) {
      // Older browsers reject actions they don't implement.
      try { ms.setActionHandler(action, handler); attached.push(action); } catch { /* unsupported */ }
    }
    return () => {
      for (const action of attached) {
        try { ms.setActionHandler(action, null); } catch { /* unsupported */ }
      }
    };
  }, [toggle, next, prev, seek, seekBy]);

  // The scrubber in the OS notification needs position updates, but only about
  // once a second — it is not worth a frame-rate feed.
  useEffect(() => {
    const ms = navigator.mediaSession;
    if (!ms?.setPositionState || !duration) return;

    let last = 0;
    return subscribeTime((time) => {
      const now = performance.now();
      if (now - last < 1000) return;
      last = now;
      try {
        ms.setPositionState({
          duration,
          position: Math.min(time, duration),
          playbackRate: player.rate,
        });
      } catch { /* position outside duration during a src swap */ }
    });
  }, [duration, subscribeTime, player.rate]);
}
