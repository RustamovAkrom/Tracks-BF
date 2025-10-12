// components/sidebar/NowPlaying.tsx (updated onSeek to percent)
"use client";

import { Track } from "@/types/tracksTypes";
import { formatTime } from "@/utils/formatTime";
import Image from "next/image";
import { Heart } from "lucide-react";

interface NowPlayingProps {
  track: Track | null;
  currentTime: number;
  progress: number;
  onSeek: (percent: number) => void;
  isLiked: boolean;
  onLike: (track: Track) => void;
}

export default function NowPlaying({
  track,
  currentTime,
  progress,
  onSeek,
  isLiked,
  onLike,
}: NowPlayingProps) {
  if (!track) return null;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    onSeek(Math.min(Math.max(percent, 0), 100));
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
      <h3 className="font-bold mb-4 text-green-400 text-sm sm:text-base">Сейчас играет</h3>
      <div className="text-center">
        <Image
          src={track.cover || "/placeholder.png"}
          alt={track.name}
          width={128}
          height={128}
          className="w-32 h-32 mx-auto rounded-xl shadow-2xl mb-4 object-cover"
          priority={false}
        />
        <h4 className="font-bold truncate text-sm sm:text-base">{track.name}</h4>
        <p className="text-gray-400 text-xs sm:text-sm truncate mb-4">{track.artist_name}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(Math.floor(currentTime))}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
          <div 
            className="w-full h-1 bg-gray-700 rounded-full cursor-pointer relative" 
            onClick={handleSeekClick}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            tabIndex={0}
          >
            <div
              className="h-1 bg-green-500 rounded-full transition-all absolute top-0 left-0"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => onLike(track)}
          className={`mt-4 p-2 rounded-full transition-colors ${
            isLiked ? 'text-pink-500 bg-pink-500/20' : 'text-gray-400 hover:text-pink-400'
          }`}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}