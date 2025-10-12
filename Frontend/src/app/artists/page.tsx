"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import type { ArtistsType } from "@/types/artistsTypes";
import { getArtists } from "@/lib/artists";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistsType[]>([]);
  const [filtered, setFiltered] = useState<ArtistsType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getArtists();
        if (mounted) {
          setArtists(data);
          setFiltered(data);
        }
      } catch (err: any) {
        setError(err?.message || "Не удалось загрузить артистов");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 🔍 Фильтрация артистов
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(artists);
    } else {
      const query = search.toLowerCase();
      setFiltered(
        artists.filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            a.slug.toLowerCase().includes(query)
        )
      );
    }
  }, [search, artists]);

  // 🌈 Общий фон с градиентом (как на странице альбомов)
  const gradientBg =
    "bg-gradient-to-b from-indigo-50 via-white to-gray-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-black";

  // 💫 Загрузка
  if (loading) {
    return (
      <div className={`min-h-screen ${gradientBg} text-center pt-28`}>
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-10">
          Featured Artists
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 sm:px-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-2xl p-4 h-44"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${gradientBg} px-4 sm:px-8 py-24 transition-colors duration-300`}>
      {/* 🧭 Заголовок */}
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text mb-4">
          Featured Artists
        </h1>

        {/* 🔍 Поле поиска */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 
                       bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* ⚠️ Ошибка */}
      {error && (
        <div className="max-w-3xl mx-auto text-center p-6 bg-red-100/50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-800 mb-10">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* 🎵 Список артистов */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 dark:text-gray-400"
          >
            No artists found.
          </motion.div>
        ) : (
          <motion.div
            key="list"
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {filtered.map((artist) => (
              <motion.div
                key={artist.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/artists/${artist.slug}`}
                  className="group flex flex-col items-center text-center bg-white/60 dark:bg-zinc-800/60 
                             hover:bg-white dark:hover:bg-zinc-700/70 rounded-2xl p-4 shadow-sm 
                             hover:shadow-lg transition-transform transform hover:-translate-y-1"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-zinc-200 dark:border-zinc-700 group-hover:border-indigo-500 transition-colors">
                    <Image
                      src={artist.avatar || "/default-avatar.png"}
                      alt={artist.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, 112px"
                    />
                  </div>

                  <h2 className="text-lg font-semibold truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {artist.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {artist.albums_count} album{artist.albums_count !== 1 ? "s" : ""}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
