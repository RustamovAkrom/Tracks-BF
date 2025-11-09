"use client";

import { usePlayer } from "@/context/PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const PlayerController = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    prev,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    likedTracks,
    toggleLike,
  } = usePlayer();

  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const savedVolume = localStorage.getItem("player_volume");
    if (savedVolume) setVolume(parseFloat(savedVolume));
  }, []);

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    localStorage.setItem("player_volume", String(v));
  };

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg z-50"
      >
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-3 sm:px-6 py-3 gap-3">
          {/* === ЛЕВАЯ ЧАСТЬ === */}
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-md flex-shrink-0">
              <Image
                src={currentTrack.cover}
                alt={currentTrack.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="truncate flex flex-col">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                {currentTrack.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentTrack.genres.map((g) => g.name).join(", ")}
              </p>
            </div>

            {/* ❤️ Лайк */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => toggleLike(currentTrack.slug)}
              className="ml-auto md:ml-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition"
            >
              <Heart
                className={`w-5 h-5 ${
                  likedTracks[currentTrack.slug]
                    ? "fill-red-500 text-red-500"
                    : ""
                }`}
              />
            </motion.button>
          </div>

          {/* === ЦЕНТР === */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3">
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => togglePlay(currentTrack)}
                className="p-3 sm:p-4 bg-blue-500 hover:bg-blue-600 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full transition shadow-md"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                )}
              </motion.button>

              <button
                onClick={next}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Прогресс-бар */}
            <div className="flex items-center gap-2 w-full mt-2">
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                {formatTime(currentTime)}
              </span>

              <div className="relative w-full h-1.5 sm:h-2 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden cursor-pointer group">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-blue-500 dark:bg-green-500"
                  style={{
                    width: duration
                      ? `${(currentTime / duration) * 100}%`
                      : "0%",
                  }}
                  layout
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 w-8">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* === ПРАВАЯ ЧАСТЬ — ГРОМКОСТЬ === */}
          <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
            <button
              onClick={() => {
                if (muted) handleVolumeChange(0.5);
                setMuted(!muted);
              }}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-24 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 accent-blue-500 cursor-pointer"
            />
          </div>

          {/* === МОБИЛЬНАЯ ГРОМКОСТЬ === */}
          <div className="flex md:hidden items-center gap-2 mt-2 w-full justify-center">
            <button
              onClick={() => setMuted(!muted)}
              className="text-gray-600 dark:text-gray-300"
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-32 h-1 rounded-full bg-gray-300 dark:bg-gray-700 accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
