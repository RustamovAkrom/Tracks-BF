"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTrackBySlug, likeTrack, PlayTrack } from "@/lib/tracks";
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
  const [isLiked, setIsLiked] = useState(false);
  const { setQueue, currentTrack, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTrackBySlug(slug!);
        setTrack(data);
        setIsLiked(data?.is_liked ?? false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handlePlay = async () => {
    if (!track) return;

    const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;

    setQueue([track]);
    togglePlay(track);

    if (!isCurrentlyPlaying) {
      try {
        const updated = await PlayTrack(track.slug);
        setTrack((prev) =>
          prev ? { ...prev, plays_count: updated.plays_count } : prev
        );
      } catch (err) {
        console.error("Ошибка увеличения plays:", err);
      }
    }
  };

  const handleLike = async () => {
    if (!track) return;
    try {
      const updated = await likeTrack(track.slug);
      setIsLiked(updated.is_liked);
      setTrack((prev) =>
        prev
          ? { ...prev, likes_count: updated.likes_count }
          : prev
      );
    } catch (err) {
      console.error("Ошибка лайка:", err);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Загрузка трека...</p>;
  if (!track)
    return <p className="text-center mt-10 text-red-500">Трек не найден</p>;

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-6 bg-gray-50 dark:bg-gray-900">
      {/* Обложка */}
      <img
        src={track.cover}
        alt={track.name}
        className="w-80 h-80 object-cover rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
      />

      {/* Информация о треке */}
      <div className="flex flex-col items-center gap-2 text-center text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-semibold">{track.name}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">{track.genre}</p>
        <p className="text-md">
          Исполнитель: <span className="font-medium">{track.artist_name}</span>
        </p>
        <p className="text-md">
          Альбом: <span className="font-medium">{track.album_name}</span>
        </p>
        <p className="text-md">Длительность: {formatDuration(track.duration)}</p>

        {/* Статистика */}
        <div className="flex items-center gap-6 mt-4 text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <Headphones className="w-5 h-5" />
            <span>{track.plays_count ?? 0}</span>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer select-none transition-all duration-200 hover:scale-110"
            onClick={handleLike}
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${
                isLiked
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            />
            <span>{track.likes_count ?? 0}</span>
          </div>
        </div>

        {/* Play кнопка */}
        <button
          onClick={handlePlay}
          className={`mt-6 flex items-center justify-center gap-2 w-36 h-12 rounded-full text-white font-semibold transition-all duration-200 ${
            currentTrack?.id === track.id && isPlaying
              ? "bg-green-500 hover:bg-green-600 scale-105"
              : "bg-blue-500 hover:bg-blue-600 scale-105"
          }`}
        >
          <Play className="w-5 h-5" />
          {currentTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
