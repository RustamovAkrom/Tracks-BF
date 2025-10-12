// components/sidebar/PopularTracks.tsx
"use client";

import { Track } from "@/types/tracksTypes";
import Image from "next/image";

interface PopularTracksProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
}

export default function PopularTracks({ tracks, onPlay }: PopularTracksProps) {
  const popular = tracks
    .sort((a, b) => b.plays_count - a.plays_count)
    .slice(0, 5);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
      <h3 className="font-bold mb-4 text-green-400 text-sm sm:text-base">🔥 Популярные треки</h3>
      <div className="space-y-3">
        {popular.map((track, idx) => (
          <div 
            key={track.id} 
            className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors"
            onClick={() => onPlay(track)}
            role="button"
            tabIndex={0}
            aria-label={`Play ${track.name}`}
          >
            <span className="text-gray-500 w-6 text-sm flex-shrink-0">{idx + 1}</span>
            <Image
              src={track.cover || "/placeholder.png"}
              alt={track.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded object-cover flex-shrink-0"
              priority={false}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium truncate">{track.name}</p>
              <p className="text-xs text-gray-400 truncate">{track.artist_name}</p>
            </div>
            <span className="text-xs text-gray-500 hidden sm:inline-flex-shrink-0">{track.plays_count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}