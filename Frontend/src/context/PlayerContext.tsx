"use client";

import { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import { TrackType } from "@/types/tracksTypes";

type LikedTracks = Record<string, boolean>;

interface PlayerContextType {
  currentTrack: TrackType | null;
  isPlaying: boolean;
  queue: TrackType[];
  currentIndex: number;
  currentTime: number;
  duration: number;
  volume: number;
  setQueue: (tracks: TrackType[]) => void;
  play: (track: TrackType, playlist?: TrackType[]) => void;
  togglePlay: (track: TrackType) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;

  likedTracks: LikedTracks;
  toggleLike: (trackSlug: string) => void;

  // Новый функционал
  shuffle: boolean;
  toggleShuffle: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<TrackType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [likedTracks, setLikedTracks] = useState<LikedTracks>({});
  const [shuffle, setShuffle] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // === Audio initialization ===
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    audio.volume = volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => next();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [volume]);

  // === Track change ===
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;
    audio.src = currentTrack.audio;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [currentTrack]);

  const play = (track: TrackType, playlist?: TrackType[]) => {
    if (playlist && playlist.length > 0) {
      setQueue(playlist);
      const idx = playlist.findIndex(t => t.id === track.id);
      setCurrentIndex(idx >= 0 ? idx : 0);
      setCurrentTrack(playlist[idx >= 0 ? idx : 0]);
    } else {
      setQueue([track]);
      setCurrentIndex(0);
      setCurrentTrack(track);
    }
    setIsPlaying(true);
  };

  const togglePlay = (track: TrackType) => {
    if (!audioRef.current) return;

    // Если тот же трек
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    } else {
      // Новый трек
      const newQueue = queue.length > 0 ? [...queue] : [track];
      if (!newQueue.find(t => t.id === track.id)) newQueue.push(track);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueue(newQueue);
      setCurrentIndex(idx);
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const toggleLike = (trackSlug: string) => {
    setLikedTracks(prev => ({
      ...prev,
      [trackSlug]: !prev[trackSlug],
    }));
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // === "Умный" Next ===
  const next = () => {
    if (queue.length === 0) return;

    let nextIndex = currentIndex + 1;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      nextIndex = 0; // зацикливаем
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      setCurrentIndex(nextIndex);
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    }
  };

  // === "Умный" Prev ===
  const prev = () => {
    if (queue.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      setCurrentIndex(prevIndex);
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setAudioVolume = (vol: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = vol;
    setVolume(vol);
  };

  const toggleShuffle = () => setShuffle(prev => !prev);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        currentIndex,
        currentTime,
        duration,
        volume,
        setQueue,
        play,
        togglePlay,
        pause,
        next,
        prev,
        seek,
        setVolume: setAudioVolume,
        likedTracks,
        toggleLike,
        shuffle,
        toggleShuffle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
