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
  play: (track: TrackType) => void;
  togglePlay: (track: TrackType) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;

  // ✅ Добавляем лайки
  likedTracks: LikedTracks;
  toggleLike: (trackSlug: string) => void;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Инициализация аудио
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

  // Воспроизведение трека
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;
    audio.src = currentTrack.audio;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [currentTrack]);

  const play = (track: TrackType) => {
    const idx = queue.findIndex(t => t.id === track.id);
    if (idx >= 0) {
      setCurrentIndex(idx);
      setCurrentTrack(queue[idx]);
    } else {
      setQueue([track]);
      setCurrentIndex(0);
      setCurrentTrack(track);
    }
    setIsPlaying(true);
  };

  const togglePlay = (track: TrackType) => {
    if (!audioRef.current) return;

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    } else {
      const newQueue = [...queue];
      if (!newQueue.find(t => t.id === track.id)) newQueue.push(track);
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setCurrentIndex(idx);
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // ✅ Лайки
  const toggleLike = (trackSlug: string) => {
    setLikedTracks(prev => {
      const liked = !prev[trackSlug];
      return { ...prev, [trackSlug]: liked };
    });
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const next = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
  };

  const prev = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
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
        toggleLike, // ✅ добавляем сюда
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
