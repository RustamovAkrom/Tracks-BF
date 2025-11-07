"use client";

import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

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
  } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 shadow-xl border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto p-4 gap-4">
        {/* Трек info + controls */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Название и жанр */}
          <div className="truncate">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{currentTrack.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
              {currentTrack.genres.map((g) => g.name).join(", ")}
            </p>
          </div>

          {/* Управление треком */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition"
            >
              <SkipBack />
            </button>
            <button
              onClick={() => togglePlay(currentTrack)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition"
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button
              onClick={next}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition"
            >
              <SkipForward />
            </button>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="flex flex-col md:flex-row items-center gap-2 flex-1">
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{formatTime(currentTime)}</span>

            <div className="relative w-full h-2 rounded bg-gray-300 dark:bg-gray-700 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-2 bg-blue-500 dark:bg-green-500 transition-all"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
              />
            </div>

            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{formatTime(duration)}</span>
          </div>

          {/* Громкость */}
          <div className="flex items-center gap-2 ml-2">
            <Volume2 />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-1 rounded-full bg-gray-300 dark:bg-gray-700 accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
