// components/sidebar/TopArtists.tsx
"use client";

import { Track } from "@/types/tracksTypes";

interface TopArtistsProps {
  tracks: Track[];
}

export default function TopArtists({ tracks }: TopArtistsProps) {
  const topArtists = Array.from(new Set(tracks.map((t) => t.artist_name))).slice(0, 5);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
      <h3 className="font-bold mb-4 text-green-400 text-sm sm:text-base">👤 Лучшие исполнители</h3>
      <div className="space-y-3">
        {topArtists.map((artist) => (
          <div key={artist} className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {artist.charAt(0).toUpperCase()}
            </div>
            <span className="flex-1 truncate text-sm">{artist}</span>
          </div>
        ))}
      </div>
    </div>
  );
}