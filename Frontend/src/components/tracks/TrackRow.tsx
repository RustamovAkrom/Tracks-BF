// components/tracks/TrackRow.tsx
"use client";

import { Track } from "@/types/tracksTypes";
import { Play, Pause, Heart } from "lucide-react";
import { formatTime } from "@/utils/formatTime";
import Image from "next/image";
import { useState } from "react";

interface TrackRowProps {
  track: Track;
  index: number;
  isCurrent: boolean;
  isLiked: boolean;
  onPlay: (track: Track) => void;
  onLike: (track: Track) => void;
  likedTracks: Set<number>;
}

export default function TrackRow({
  track,
  index,
  isCurrent,
  isLiked,
  onPlay,
  onLike,
  likedTracks,
}: TrackRowProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 
        hover:bg-white/5 transition-colors duration-200 group cursor-pointer
        ${isCurrent ? "bg-green-500/10" : ""}`}
      onDoubleClick={() => onPlay(track)}
      role="button"
      tabIndex={0}
      aria-label={`Play ${track.name} by ${track.artist_name}`}
    >
      {/* Index */}
      <div className="col-span-1 flex items-center justify-center text-gray-400">
        {index + 1}
      </div>

      {/* Play/Pause button */}
      <div className="col-span-1 flex items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay(track);
          }}
          className="text-green-400 hover:text-green-300 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label={isCurrent && likedTracks.has(track.id) ? "Pause" : "Play"}
        >
          {isCurrent ? (
            <Pause className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Play className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Track Info */}
      <div className="col-span-1 sm:col-span-5 flex items-center gap-3">
        <Image
          src={!imgError && track.cover ? track.cover : "/placeholder.png"}
          alt={`${track.name} cover`}
          width={48}
          height={48}
          className="w-12 h-12 rounded-lg object-cover shadow-lg"
          loading="lazy"
          onErrorCapture={() => setImgError(true)}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`font-medium truncate ${
              isCurrent ? "text-green-400" : "text-white"
            }`}
          >
            {track.name}
          </p>
          <p className="text-sm text-gray-400 truncate">{track.artist_name}</p>
        </div>
      </div>

      {/* Album */}
      <div className="hidden sm:flex sm:col-span-2 items-center text-gray-400 truncate">
        {track.album_name}
      </div>

      {/* Genre */}
      <div className="hidden sm:flex sm:col-span-2 items-center">
        <span className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
          {track.genre}
        </span>
      </div>

      {/* Like & count */}
      <div className="sm:col-span-1 flex items-center justify-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(track);
          }}
          className={`transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            isLiked
              ? "text-pink-500"
              : "text-gray-400 hover:text-pink-400"
          }`}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <Heart
            className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
            aria-hidden="true"
          />
        </button>
        <span className="text-xs text-gray-500 hidden sm:inline">
          {track.likes_count}
        </span>
      </div>

      {/* Duration */}
      <div className="col-span-1 flex items-center justify-end">
        <span className="text-gray-400 text-sm">
          {formatTime(track.duration)}
        </span>
      </div>

      {/* Mobile: likes + duration */}
      <div className="sm:hidden col-span-full flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(track);
            }}
            className={`transition-colors ${
              isLiked ? "text-pink-500" : "text-gray-400 hover:text-pink-400"
            }`}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
              aria-hidden="true"
            />
          </button>
          <span className="text-xs text-gray-500">{track.likes_count}</span>
        </div>
        <span className="text-gray-400 text-sm">
          {formatTime(track.duration)}
        </span>
      </div>
    </div>
  );
}
