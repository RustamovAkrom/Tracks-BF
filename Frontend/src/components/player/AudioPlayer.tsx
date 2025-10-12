// components/player/AudioPlayer.tsx (updated to use percent for seek)
"use client";

import { Track } from "@/types/tracksTypes";
import { formatTime } from "@/utils/formatTime";
import { Play, Pause, Heart, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from "lucide-react";
import Image from "next/image";

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  progress: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: number;
  likedTracks: Set<number>;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (percent: number) => void;
  onVolumeChange: (value: number) => void;
  onLike: (track: Track) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export default function AudioPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  progress,
  volume,
  isShuffled,
  repeatMode,
  likedTracks,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onLike,
  onToggleShuffle,
  onToggleRepeat,
}: AudioPlayerProps) {
  if (!currentTrack) return null;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    onSeek(Math.min(Math.max(percent, 0), 100)); // Clamp to 0-100
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-2 sm:p-4 z-40">
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-full sm:w-80 order-2 sm:order-1">
          <Image
            src={currentTrack.cover || "/placeholder.png"}
            alt={currentTrack.name}
            width={56}
            height={56}
            className="w-14 h-14 rounded-lg shadow-lg object-cover flex-shrink-0"
            priority={false}
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate text-sm">{currentTrack.name}</p>
            <p className="text-xs text-gray-400 truncate">{currentTrack.artist_name}</p>
          </div>
          <button
            onClick={() => onLike(currentTrack)}
            className={`p-1 rounded-full transition-colors ml-2 ${
              likedTracks.has(currentTrack.id) ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'
            }`}
            aria-label={likedTracks.has(currentTrack.id) ? "Unlike" : "Like"}
          >
            <Heart className={`w-4 h-4 ${likedTracks.has(currentTrack.id) ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 max-w-2xl order-1 sm:order-2">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 px-2">
            <button
              onClick={onToggleShuffle}
              className={`transition-colors p-1 sm:p-2 rounded-full ${
                isShuffled ? 'text-green-400' : 'text-gray-400 hover:text-white'
              }`}
              aria-label={isShuffled ? "Выключить shuffle" : "Включить shuffle"}
            >
              <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </button>
            <button
              onClick={onPrevious}
              className="text-gray-400 hover:text-white transition-colors p-1 sm:p-2 rounded-full"
              aria-label="Previous track"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </button>
            <button
              onClick={onPlayPause}
              className="bg-white text-black hover:bg-gray-200 p-2 sm:p-3 rounded-full transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={onNext}
              className="text-gray-400 hover:text-white transition-colors p-1 sm:p-2 rounded-full"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </button>
            <button
              onClick={onToggleRepeat}
              className={`transition-colors p-1 sm:p-2 rounded-full ${
                repeatMode > 0 ? 'text-green-400' : 'text-gray-400 hover:text-white'
              }`}
              aria-label={`Repeat mode: ${repeatMode === 0 ? 'Off' : repeatMode === 1 ? 'All' : 'One'}`}
            >
              <Repeat className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              {repeatMode === 2 && <span className="text-xs">1</span>}
            </button>
          </div>

          {/* Progress Bar */}
          <div 
            className="flex items-center gap-2 text-xs text-gray-400 px-2"
            onClick={handleProgressClick}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            tabIndex={0}
          >
            <span>{formatTime(Math.floor(currentTime))}</span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer relative">
              <div
                className="h-1 bg-white rounded-full transition-all hover:bg-green-400 absolute top-0 left-0"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-32 order-3 justify-end px-2 sm:px-0">
          <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value) / 100)}
            className="flex-1 h-1 bg-gray-700 rounded-full appearance-none slider w-full"
            aria-label="Volume"
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}