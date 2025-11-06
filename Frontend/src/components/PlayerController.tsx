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
    <div className="fixed bottom-0 left-0 w-full bg-gray-100 dark:bg-gray-900 shadow-lg px-4 py-3 z-50 flex justify-center">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl">
        {/* Трек */}
        <div className="flex flex-col md:flex-row items-center gap-4 flex-1 justify-center md:justify-start">
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{currentTrack.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">{currentTrack.genre}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
            >
              <SkipBack />
            </button>
            <button
              onClick={() => togglePlay(currentTrack)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button
              onClick={next}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
            >
              <SkipForward />
            </button>
          </div>
        </div>

        {/* Прогресс и громкость */}
        <div className="flex items-center gap-2 flex-1 justify-center md:justify-end">
          <span className="text-sm">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm">{formatTime(duration)}</span>

          <div className="flex items-center gap-2 ml-2">
            <Volume2 />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
