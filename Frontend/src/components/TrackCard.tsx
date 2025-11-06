// src/components/TrackCard.tsx
"use client";

import { TrackType } from "@/types/tracksTypes";
import Link from "next/link";
import { Play } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface TrackCardProps {
  track: TrackType;
  allTracks: TrackType[];
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, allTracks }) => {
  const { togglePlay, currentTrack, isPlaying, setQueue } = usePlayer();

  const handlePlay = () => {
    setQueue(allTracks); // ставим очередь всех треков
    togglePlay(track);
  };

  const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/tracks/${track.slug}`}>
        <img
          src={track.cover}
          alt={track.name}
          className="w-full h-48 object-cover cursor-pointer"
        />
      </Link>
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {track.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
          {track.genre}
        </p>

        <button
          onClick={handlePlay}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors duration-300 ${
            isCurrentPlaying
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <Play className="w-5 h-5" />
          {isCurrentPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};
