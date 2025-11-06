// src/pages/tracks.tsx
"use client";

import { useEffect, useState } from "react";
import { getTracks } from "@/lib/tracks";
import { TrackType } from "@/types/tracksTypes";
import { TrackCard } from "@/components/TrackCard";

export default function TracksPage() {
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTracks();
        setTracks(data);
      } catch (err) {
        console.error(err);
        setError("Ошибка при загрузке треков");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Загрузка треков...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    // pt-16 создаёт отступ под фиксированный хедер (~64px)
    <div className="min-h-screen flex flex-col items-center justify-between px-6 
      bg-gradient-to-b from-white via-gray-100 to-gray-200 
      dark:from-black dark:via-gray-900 dark:to-gray-800 
      text-gray-900 dark:text-white transition-colors duration-300">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
        w-full max-w-7xl py-10 mx-auto">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} allTracks={tracks}/>
        ))}
      </div>
    </div>
  );
}
