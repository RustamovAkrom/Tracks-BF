"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Music, Search } from "lucide-react";
import { getAlbums } from "@/lib/albums";
import type { AlbumsType } from "@/types/albumsTypes";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<AlbumsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // 🔹 Загрузка альбомов
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getAlbums()
      .then((data) => {
        if (mounted) setAlbums(Array.isArray(data) ? data : []);
      })
      .catch((err: any) => {
        if (mounted) setError(err?.message || "Не удалось загрузить альбомы");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // 🔹 Генерация списка жанров (для фильтра)
  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const album of albums) {
      if (album.name) set.add(album.name); // если у тебя нет жанра в данных, можно использовать name как временный фильтр
    }
    return ["All", ...Array.from(set).sort()];
  }, [albums]);

  // 🔹 Фильтрация альбомов
  const filteredAlbums = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return albums.filter((album) => {
      const matchesSearch = album.name.toLowerCase().includes(q);
      return selectedGenre === "All"
        ? matchesSearch
        : matchesSearch && album.name === selectedGenre;
    });
  }, [albums, searchQuery, selectedGenre]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-20">
      {/* ===== Header ===== */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Music className="w-6 h-6 text-indigo-500" />
            Albums
          </h1>
          <p className="text-sm text-gray-500">
            Explore music albums — search, filter and discover.
          </p>
        </div>

        {/* ===== Search & Filter ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm flex-1 sm:flex-none">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search albums..."
              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200"
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* ===== Loading Skeleton ===== */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl"
            >
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* ===== Error ===== */}
      {!loading && error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md text-center">
          {error}
        </div>
      )}

      {/* ===== Empty ===== */}
      {!loading && !error && filteredAlbums.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            No albums found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try clearing filters or check back later.
          </p>
        </div>
      )}

      {/* ===== Album List ===== */}
      {!loading && !error && filteredAlbums.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAlbums.map((album) => (
            <article
              key={album.id}
              className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <Link
                href={`/albums/${album.slug ?? album.id}`}
                className="block w-full h-full"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={album.cover || "/default-album.png"}
                    alt={album.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1 text-gray-800 dark:text-gray-100">
                    {album.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                    Album ID: {album.id}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
