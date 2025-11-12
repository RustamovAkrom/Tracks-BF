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
  const { togglePlay, currentTrack, isPlaying, setQueue, likedTracks, toggleLike } = usePlayer();
  const [likes, setLikes] = useState(track.likes_count);
  const [plays, setPlays] = useState(track.plays_count);

  // Получаем глобальный статус лайка
  const isLiked = likedTracks[track.slug] ?? track.is_liked ?? false;

  const handlePlay = async () => {
    setQueue(allTracks);
    const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
    togglePlay(track);

    if (!isCurrentlyPlaying) {
      try {
        const updated = await PlayTrack(track.slug);
        setPlays(updated.plays_count);
      } catch (err) {
        console.error("Ошибка увеличения plays:", err);
      }
    }
  };

  const handleLike = async () => {
    try {
      await likeTrack(track.slug);
      toggleLike(track.slug); // обновляем глобальный контекст
      setLikes((prev) => prev + (isLiked ? -1 : 1)); // мгновенное обновление числа лайков
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;

  return (
    <div className="bg-gradient-to-b from-gray-50/80 dark:from-gray-900/80 to-white dark:to-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
      <div className="relative w-full h-60 cursor-pointer group">
        <Link href={`/tracks/${track.slug}`}>
          <img
            src={track.cover}
            alt={track.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <button
          onClick={handlePlay}
          className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg text-white transition-colors duration-300 ${
            isCurrentPlaying ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <Play className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{track.name}</h3>

        {/* <div className="flex flex-wrap gap-1">
          {track.genres.map((g) => (
            <span
              key={g.id}
              className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100"
            >
              {g.name}
            </span>
          ))}
        </div> */}

        <div className="flex items-center justify-between mt-2 text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1 text-sm">
            <Heart
              className={`w-4 h-4 cursor-pointer transition-colors ${
                isLiked ? "text-red-500 fill-red-500" : "text-gray-400 dark:text-gray-500"
              }`}
              onClick={handleLike}
            />
            {likes}
          </span>
          <span className="flex items-center gap-1 text-sm">
            <Headphones className="w-4 h-4" /> {plays}
          </span>
        </div>
      </div>
    </div>
  );
};
