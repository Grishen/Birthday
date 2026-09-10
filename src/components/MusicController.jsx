import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";

const MusicController = forwardRef(function MusicController(_, ref) {
  const audioRef = useRef(null);
  const [available, setAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const audio = new Audio(birthdayConfig.musicSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = birthdayConfig.musicVolume ?? 0.6;
    const fail = () => {
      if (!cancelled) setAvailable(false);
    };
    audio.addEventListener("error", fail);
    audioRef.current = audio;

    return () => {
      cancelled = true;
      audio.pause();
      audio.removeEventListener("error", fail);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    playForUnlock: async () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = birthdayConfig.musicVolume ?? 0.6;
      audio.currentTime = 0;
      try {
        await audio.play();
        setPlaying(true);
        setAvailable(true);
      } catch {
        setAvailable(false);
      }
    },
    stop: () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
      audio.volume = birthdayConfig.musicVolume ?? 0.6;
      setPlaying(false);
    },
    fadeOut: (ms = 2000) => {
      const audio = audioRef.current;
      if (!audio) return Promise.resolve();
      const start = Number.isFinite(audio.volume) ? audio.volume : 0.6;
      const t0 = performance.now();
      return new Promise((resolve) => {
        let done = false;
        const end = () => {
          if (done) return;
          done = true;
          try {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = birthdayConfig.musicVolume ?? 0.6;
          } catch {
            /* ignore */
          }
          setPlaying(false);
          resolve();
        };
        window.setTimeout(end, ms + 120);
        const tick = (now) => {
          if (done) return;
          const p = Math.min((now - t0) / ms, 1);
          try {
            audio.volume = Math.max(start * (1 - p), 0);
          } catch {
            end();
            return;
          }
          if (p < 1) requestAnimationFrame(tick);
          else end();
        };
        requestAnimationFrame(tick);
      });
    },
  }));

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.volume = birthdayConfig.musicVolume ?? 0.6;
        await audio.play();
        setPlaying(true);
      }
    } catch {
      setAvailable(false);
    }
  };

  if (!available) return null;

  return (
    <button className="music-btn" type="button" onClick={toggle} aria-pressed={playing}>
      {playing ? (
        <>
          <span className="viz" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Pause
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 13a2 2 0 1 1-2-2V4l8-2v9a2 2 0 1 1-2-2V5L6 6v7z" fill="currentColor" />
          </svg>
          {birthdayConfig.musicLabel}
        </>
      )}
    </button>
  );
});

export default MusicController;
