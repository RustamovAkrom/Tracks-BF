// src/context/PlayerContext.tsx
"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TrackType } from "@/types/tracksTypes";
import { postPlayCount } from "@/lib/tracks";

type PlayerContextType = {
  currentTrack: TrackType | null;
  isPlaying: boolean;
  currentTime: number; // seconds
  duration: number; // seconds
  progress: number; // 0..1 (derived)
  queue: TrackType[];
  play: (track: TrackType, opts?: { addToQueue?: boolean }) => void;
  toggle: () => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (timeSeconds: number) => void;
  setVolume: (v: number) => void;
  setQueue: (q: TrackType[]) => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRafRef = useRef<number>(0);
  const postedPlayRef = useRef<number | null>(null); // id of track for which postPlayCount already sent

  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);
  const [queue, setQueueState] = useState<TrackType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(1);

  // derived
  const progress = duration > 0 ? currentTime / duration : 0;

  // Init single Audio instance
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    audio.volume = volume;
    audioRef.current = audio;

    const onLoadedMeta = () => {
      if (!audioRef.current) return;
      setDuration(isFinite(audioRef.current.duration) ? audioRef.current.duration : 0);
    };

    const onTimeUpdate = () => {
      // we'll throttle actual setState via RAF loop (below) — keep this for compatibility/guarantee
      // update small immediate values as fallback
      if (!audioRef.current) return;
      setCurrentTime(audioRef.current.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
      // auto next (cyclic)
      playNext();
    };

    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // RAF loop: update currentTime less frequently and in sync with rendering
  useEffect(() => {
    const loop = (ts: number) => {
      // throttle to ~60fps but only update state if 200ms passed to reduce re-renders
      if (!audioRef.current) return;
      const now = performance.now();
      if (now - lastRafRef.current > 200) {
        lastRafRef.current = now;
        setCurrentTime(audioRef.current.currentTime);
        setDuration(isFinite(audioRef.current.duration) ? audioRef.current.duration : 0);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  // apply volume changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // helper: find index in queue
  const indexOfTrack = useCallback(
    (track: TrackType) => queue.findIndex((t) => t.id === track.id),
    [queue]
  );

  // internal play implementation
  const internalPlay = useCallback(
    async (track: TrackType, triggerPostPlay = true) => {
      if (!audioRef.current) return;
      if (!track.audio) {
        console.warn("Track has no audio src:", track);
        return;
      }

      // set current track and src
      try {
        // NOTE: set src before play to ensure metadata loads
        if (audioRef.current.src !== track.audio) {
          audioRef.current.src = track.audio;
          // quick reset currentTime
          audioRef.current.currentTime = 0;
        }
        // try to play
        await audioRef.current.play();
        setIsPlaying(true);
        setCurrentTrack(track);
        setDuration(isFinite(audioRef.current.duration) ? audioRef.current.duration : 0);
        // send postPlayCount only once per track start
        if (triggerPostPlay && postedPlayRef.current !== track.id) {
          postedPlayRef.current = track.id;
          postPlayCount(track.id).catch((e) => console.warn("postPlayCount error:", e));
        }
      } catch (err) {
        console.warn("Audio play failed:", err);
        setIsPlaying(false);
      }
    },
    []
  );

  // public API: play
  const play = useCallback(
    (track: TrackType, opts?: { addToQueue?: boolean }) => {
      // default: addToQueue = true (behaviour A: add to end if not in queue)
      const addToQueue = opts?.addToQueue ?? true;

      setQueueState((prevQueue) => {
        // if queue is empty and we have list from caller, we expect caller to call setQueue before or after
        const existsIndex = prevQueue.findIndex((t) => t.id === track.id);
        let newQueue = prevQueue;
        if (existsIndex === -1 && addToQueue) {
          newQueue = [...prevQueue, track];
        } else if (existsIndex === -1 && !addToQueue) {
          // not adding to queue per opts -> replace queue by single track
          newQueue = [track];
        }
        // update currentIndex to location of track in newQueue
        const newIndex = newQueue.findIndex((t) => t.id === track.id);
        setCurrentIndex(newIndex);
        return newQueue;
      });

      // actually play
      internalPlay(track, true);
    },
    [internalPlay]
  );

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // cyclic next/prev (you chose loop behavior B earlier)
  const playNext = useCallback(() => {
    setQueueState((q) => {
      if (!q || q.length === 0) return q;
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 < q.length ? prevIndex + 1 : 0; // cyclic
        const nextTrack = q[nextIndex];
        // play next
        internalPlay(nextTrack, true);
        return nextIndex;
      });
      return q;
    });
  }, [internalPlay]);

  const playPrev = useCallback(() => {
    setQueueState((q) => {
      if (!q || q.length === 0) return q;
      setCurrentIndex((prevIndex) => {
        const prevIdx = prevIndex - 1 >= 0 ? prevIndex - 1 : q.length - 1; // cyclic
        const prevTrack = q[prevIdx];
        internalPlay(prevTrack, true);
        return prevIdx;
      });
      return q;
    });
  }, [internalPlay]);

  const seek = useCallback((timeSeconds: number) => {
    if (!audioRef.current) return;
    const t = Math.max(0, Math.min(timeSeconds, audioRef.current.duration || timeSeconds));
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  }, []);

  const setVolume = useCallback((v: number) => {
    const vol = Math.max(0, Math.min(1, v));
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  // replace queue (used by page when starting play-from-list)
  const setQueue = useCallback((q: TrackType[]) => {
    setQueueState(q ?? []);
    // try to keep currentTrack index if exists; otherwise reset to -1
    setCurrentIndex((curIdx) => {
      if (!q || q.length === 0) return -1;
      if (currentTrack) {
        const found = q.findIndex((t) => t.id === currentTrack.id);
        return found;
      }
      return -1;
    });
  }, [currentTrack]);

  // cleanup postedPlayRef when track changes
  useEffect(() => {
    // whenever currentTrack becomes a new id, postedPlayRef is handled inside internalPlay
    // if track removed, reset postedPlayRef
    if (!currentTrack) postedPlayRef.current = null;
  }, [currentTrack]);

  const ctx: PlayerContextType = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    queue,
    play,
    toggle,
    pause,
    playNext,
    playPrev,
    seek,
    setVolume,
    setQueue,
    audioRef,
  };

  return <PlayerContext.Provider value={ctx}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
};
