// src/app/tracks/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Heart, Headphones } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { getTracks, likeTrack } from "@/lib/tracks";
import { TrackType } from "@/types/tracksTypes";

export default function TracksPage() {
  const { play, setQueue, currentTrack } = usePlayer();
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** ✅ Запуск трека + сохранение очереди, но только один раз */
  function handlePlay(track: TrackType) {
    if (tracks.length > 0 && currentTrack === null) {
      setQueue(tracks); // очередь сохраняется только при первом запуске
    }
    play(track);
  }

  useEffect(() => {
    let mounted = true;
    async function fetchTracks() {
      try {
        const data = await getTracks();
        if (mounted) setTracks(data);
      } catch {
        if (mounted) setError("Failed to load tracks");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchTracks();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLike(trackId: number) {
    try {
      await likeTrack(trackId);
      setTracks(prev =>
        prev.map(t =>
          t.id === trackId ? { ...t, likes_count: t.likes_count + 1 } : t
        )
      );
    } catch (e) {
      console.error("Like error:", e);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12
      bg-gradient-to-b from-white via-gray-100 to-gray-200 
      dark:from-black dark:via-gray-900 dark:to-gray-800 
      text-gray-900 dark:text-white transition-colors duration-300"
    >
      <section className="mt-24 w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center">🔥 Trending Tracks</h2>

        {loading && <p className="text-center text-gray-500">Loading tracks...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading &&
            tracks.map(track => (
              <article
                key={track.id}
                className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-md border border-gray-200/20 hover:shadow-xl hover:scale-[1.03] transition overflow-hidden"
              >
                {/* ✅ Кликабельный переход к деталям трека */}
                <Link href={`/tracks/${track.slug}`}>
                  <img
                    src={track.cover}
                    alt={track.name}
                    className="w-full h-40 object-cover cursor-pointer hover:brightness-90 transition"
                  />
                </Link>

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{track.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{track.genre}</p>

                  <div className="flex justify-between text-sm mt-2 text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Headphones size={15} /> {track.plays_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={15} /> {track.likes_count}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handlePlay(track)}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition flex items-center justify-center gap-2"
                    >
                      <Play size={18} /> Play
                    </button>

                    <button
                      onClick={() => handleLike(track.id)}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <Heart size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  );
}
