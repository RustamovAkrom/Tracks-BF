// src/components/TrackCard.tsx
"use client";

import { TrackType } from "@/types/tracksTypes";
import Link from "next/link";
import { Play, Heart, Headphones } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { likeTrack, PlayTrack } from "@/lib/tracks";
import { useState } from "react";

interface TrackCardProps {
  track: TrackType;
  allTracks: TrackType[];
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, allTracks }) => {
  const { togglePlay, currentTrack, isPlaying, setQueue } = usePlayer();
  const [likes, setLikes] = useState(track.likes_count);
  const [isLiked, setIsLiked] = useState(track.is_liked ?? false);
  const [plays, setPlays] = useState(track.plays_count); // новый state для plays

  const handlePlay = async () => {
    setQueue(allTracks);
    const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
    togglePlay(track);

    // увеличиваем plays_count только если трек не играет сейчас
    if (!isCurrentlyPlaying) {
      try {
        const updated = await PlayTrack(track.slug);
        setPlays(updated.plays_count); // обновляем локально
      } catch (err) {
        console.error("Ошибка увеличения plays:", err);
      }
    }
  };

  const handleLike = async () => {
    try {
      await likeTrack(track.slug);
      setIsLiked(!isLiked);
      setLikes((prev) => prev + (isLiked ? -1 : 1));
    } catch (error) {
      console.error("Like error:", error);
    }
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

      <div className="p-4 flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {track.name}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-300">{track.genre}</p>

        {/* ✅ Likes + Plays UI */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1">
            <Heart className={`w-4 h-4 ${isLiked ? "text-red-500" : ""}`} />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <Headphones className="w-4 h-4" /> {plays}
          </span>

        </div>

        {/* ✅ Play Button */}
        <button
          onClick={handlePlay}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors duration-300 ${isCurrentPlaying
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
        >
          <Play className="w-5 h-5" />
          {isCurrentPlaying ? "Pause" : "Play"}
        </button>

        {/* ✅ Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg border transition ${isLiked
            ? "border-red-500 text-red-500"
            : "border-gray-500 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            }`}
        >
          <Heart className="w-5 h-5" fill={isLiked ? "red" : "none"} />
          {isLiked ? "Unlike" : "Like"}
        </button>
      </div>
    </div>
  );
};
