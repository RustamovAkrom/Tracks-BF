"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTrackBySlug, likeTrack, PlayTrack, getSimilarTracks } from "@/lib/tracks";
import { TrackType } from "@/types/tracksTypes";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, Headphones, Heart, Share2, Download } from "lucide-react";
import { TrackCard } from "@/components/TrackCard";
import { TrackShare } from "@/components/TrackShare";
import Link from "next/link";


export default function TrackDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug; // безопасно достаём string

  const [track, setTrack] = useState<TrackType | null>(null);
  const [similar, setSimilar] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { setQueue, currentTrack, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    if (!slug) return; // безопасно, если slug отсутствует

    const fetchData = async () => {
      setLoading(true);
      try {
        const data: TrackType = await getTrackBySlug(slug) as TrackType;
        setTrack(data);
        setIsLiked(data.is_liked ?? false);

        const recs: TrackType[] = await getSimilarTracks(slug);
        setSimilar(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);


  if (loading) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300 animate-pulse">Загрузка трека...</p>;
  if (!track) return <p className="text-center mt-10 text-red-500">Трек не найден</p>;

  const handlePlay = async () => {
    const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
    setQueue([track]);
    togglePlay(track);

    if (!isCurrentlyPlaying) {
      try {
        const updated = await PlayTrack(track.slug);
        setTrack(prev => prev ? { ...prev, plays_count: updated.plays_count } : prev);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLike = async () => {
    try {
      const updated = await likeTrack(track.slug);
      setIsLiked(updated.is_liked);
      setTrack(prev => prev ? { ...prev, likes_count: updated.likes_count } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-12 p-6 bg-gray-50 dark:bg-gray-900">

      {/* Основной трек */}
      <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl">
        <img
          src={track.cover}
          alt={track.name}
          className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700"
        />

        <div className="flex flex-col gap-4 md:gap-6 w-full md:flex-1">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{track.name}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-gray-700 dark:text-gray-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-gray-700 dark:text-gray-300">
              <span>
                Исполнитель:{" "}
                <Link
                  href={`/artists/${track.artist.slug}`}
                  className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
                >
                  {track.artist.name}
                </Link>
              </span>

              <span>
                Альбом:{" "}
                {track.album ? (
                  <Link
                    href={`/albums/${track.album.slug}`}
                    className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
                  >
                    {track.album.name}
                  </Link>
                ) : (
                  <span className="font-medium">{track.album ?? "Single"}</span>
                )}
              </span>

              <span>
                Длительность: <span className="font-medium">{formatDuration(track.duration)}</span>
              </span>
            </div>
          </div>

          {/* Жанры */}
          <div className="flex flex-wrap gap-2">
            {track.genres.map(g => (
              <span key={g.id} className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs font-semibold">
                {g.name}
              </span>
            ))}
          </div>

          {/* Статистика и действия */}
          <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-600 dark:text-gray-300">

            {/* Прослушивания */}
            <div className="flex items-center gap-1">
              <Headphones className="w-5 h-5" />
              <span>{track.plays_count}</span>
            </div>

            {/* Лайк */}
            <div
              onClick={handleLike}
              className="flex items-center gap-1 cursor-pointer transition-all hover:scale-110 select-none"
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400 dark:text-gray-500"
                  }`}
              />
              <span>{track.likes_count}</span>
            </div>

            {/* Share */}
            <TrackShare track={track} />

            {/* Download кнопка */}
            <div className="flex items-center gap-1 cursor-pointer transition-all hover:scale-110 select-none">
              <Download className="w-5 h-5" />
              <a
                href={track.audio}
                download
                className="text-sm font-medium text-gray-800 dark:text-gray-100 hover:underline"
              >
                Download
              </a>
            </div>
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className={`mt-4 w-40 h-14 rounded-full font-semibold text-white flex items-center justify-center gap-2 transition-transform duration-200 transform ${currentTrack?.id === track.id && isPlaying ? "bg-green-500 hover:bg-green-600 scale-105" : "bg-blue-500 hover:bg-blue-600 scale-105"}`}
          >
            {currentTrack?.id === track.id && isPlaying ? <Pause className="w-5 h-5 animate-pulse" /> : <Play className="w-5 h-5" />}
            {currentTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
          </button>

          {/* Описание трека */}
          {track.description && (
            <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">{track.description}</p>
          )}
        </div>
      </div>

      {/* Похожие треки */}
      {similar.length > 0 && (
        <div className="w-full max-w-6xl mt-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100 text-center">
            Похожие треки
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similar.map(t => (
              <TrackCard key={t.slug} track={t} allTracks={similar} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
