// components/tracks/TracksTable.tsx
"use client";

import { Track } from "@/types/tracksTypes";
import TrackRow from "./TrackRow";
import { Clock } from "lucide-react";

interface TracksTableProps {
  tracks: Track[];
  filteredTracks: Track[];
  currentTrack: Track | null;
  likedTracks: Set<number>;
  onPlay: (track: Track) => void;
  onLike: (track: Track) => void;
}

export default function TracksTable({
  tracks,
  filteredTracks,
  currentTrack,
  likedTracks,
  onPlay,
  onLike,
}: TracksTableProps) {
  if (filteredTracks.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 text-center text-gray-400">
        Нет треков по вашему запросу.
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden">
      {/* Table Header (desktop only) */}
      <div className="hidden sm:grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-400 border-b border-gray-800">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5">Название</div>
        <div className="col-span-2">Альбом</div>
        <div className="col-span-2">Жанр</div>
        <div className="col-span-1 flex justify-center">
          <Clock className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* Tracks List */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {filteredTracks.map((track, idx) => (
          <TrackRow
            key={track.id}
            track={track}
            index={idx}
            isCurrent={currentTrack?.id === track.id}
            isLiked={likedTracks.has(track.id)}
            onPlay={onPlay}
            onLike={onLike}
            likedTracks={likedTracks}
          />
        ))}
      </div>
    </div>
  );
}
