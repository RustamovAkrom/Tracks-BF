"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Music } from "lucide-react";
import { getAlbum } from "@/lib/albums";
import { TrackCard } from "@/components/TrackCard";
import { TrackType } from "@/types/tracksTypes";
import { usePlayer } from "@/context/PlayerContext";

interface AlbumDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setQueue, play } = usePlayer();

  // ===== resolve params =====
  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    })();
  }, [params]);

  // ===== fetch album =====
  useEffect(() => {
    if (!slug) return;
    const fetchAlbum = async () => {
      try {
        const data = await getAlbum(slug);
        setAlbum(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [slug]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-700 dark:text-gray-300 animate-pulse">
        Загрузка альбома...
      </p>
    );

  if (!album)
    return (
      <p className="text-center mt-20 text-red-500">Альбом не найден</p>
    );

  // ===== Функция "Play All" =====
  const handlePlayAll = () => {
    if (album.tracks.length > 0) {
      setQueue(album.tracks);
      play(album.tracks[0]);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-900 dark:text-white">

      {/* ===== Фоновое изображение с блюром ===== */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={album.cover || "/default-album.png"}
          alt={album.name}
          fill
          className="object-cover blur-2xl opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-gray-900/70 to-black/90" />
      </div>

      {/* ===== Контейнер ===== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* ===== Информация об альбоме ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center gap-10 mb-14"
        >
          {/* Обложка */}
          <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={album.cover || "/default-album.png"}
              alt={album.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Текстовая информация */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              {album.name}
            </h1>

            <Link
              href={`/artists/${album.artist.slug}`}
              className="text-indigo-400 hover:text-indigo-300 text-lg font-medium transition"
            >
              {album.artist.name}
            </Link>

            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3 text-sm text-gray-300">
              {album.genre && (
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                  {album.genre}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                {album.tracks_count} {album.tracks_count === 1 ? "track" : "tracks"}
              </span>
              {album.release_date && (
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                  {new Date(album.release_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              )}
            </div>

            {/* Кнопка Play All */}
            <motion.button
              onClick={handlePlayAll}
              whileTap={{ scale: 0.9 }}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full text-white font-medium transition shadow-lg"
            >
              <Play className="w-5 h-5" />
              Play All
            </motion.button>
          </div>
        </motion.div>

        {/* ===== Список треков ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {album.tracks.map((track: TrackType) => (
            <TrackCard key={track.id} track={track} allTracks={album.tracks} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
