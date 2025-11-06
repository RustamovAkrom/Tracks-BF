"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTrackBySlug } from "@/lib/tracks";
import { TrackType } from "@/types/tracksTypes";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Headphones, Heart } from "lucide-react";

type Params = {
  slug: string;
};

export default function TrackDetailPage() {
  const { slug } = useParams() as Params;
  const [track, setTrack] = useState<TrackType | null>(null);
  const [loading, setLoading] = useState(true);
  const { play, setQueue, currentTrack, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTrackBySlug(slug!);
        setTrack(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handlePlay = () => {
    if (!track) return;
    setQueue([track]);
    togglePlay(track);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading)
    return <p className="text-center mt-10">Загрузка трека...</p>;
  if (!track)
    return <p className="text-center mt-10 text-red-500">Трек не найден</p>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center gap-6">
      <img
        src={track.cover}
        alt={track.name}
        className="w-80 h-80 object-cover rounded-lg shadow-md"
      />

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {track.name}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-300">{track.genre}</p>
        <p className="text-md text-gray-600 dark:text-gray-400">
          Исполнитель: <span className="font-semibold">{track.artist_name}</span>
        </p>
        <p className="text-md text-gray-600 dark:text-gray-400">
          Альбом: <span className="font-semibold">{track.album_name}</span>
        </p>
        <p className="text-md text-gray-600 dark:text-gray-400">
          Длительность: {formatDuration(track.duration)}
        </p>

        <div className="flex items-center gap-6 mt-4 text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <Headphones className="w-5 h-5" />
            <span>{track.plays_count ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-5 h-5" />
            <span>{track.likes_count ?? 0}</span>
          </div>
        </div>

        <button
          onClick={handlePlay}
          className="mt-4 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors duration-300"
        >
          <Play className="w-5 h-5" />
          {currentTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
