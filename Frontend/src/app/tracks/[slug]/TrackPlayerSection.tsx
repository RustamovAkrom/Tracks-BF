// src/app/tracks/[slug]/TrackPlayerSection.tsx
"use client";

import { usePlayer } from "@/context/PlayerContext";
import { likeTrack } from "@/lib/tracks";
import { TrackType } from "@/types/tracksTypes";
import { Play, Heart } from "lucide-react";
import { useState } from "react";

export default function TrackPlayerSection({ track }: { track: TrackType }) {
  const { play } = usePlayer();
  const [likes, setLikes] = useState(track.likes_count);

  async function handleLike() {
    try {
      await likeTrack(track.id);
      setLikes(likes + 1);
    } catch (e) {
      console.error("Like error:", e);
    }
  }

  return (
    <div className="mt-6 flex gap-4">
      <button
        onClick={() => play(track, { addToQueue: false })}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-500 transition"
      >
        <Play size={20} /> Play
      </button>

      <button
        onClick={handleLike}
        className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        <Heart size={20} className="text-red-500" /> {likes}
      </button>
    </div>
  );
}
