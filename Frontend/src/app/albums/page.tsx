"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Music, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getAlbums } from "@/lib/albums";
import type { AlbumsType } from "@/types/albumsTypes";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<AlbumsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOption, setSortOption] = useState("name");
  const [page, setPage] = useState(1);

  const itemsPerPage = 8;

  // ===== Загрузка альбомов =====
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAlbums()
      .then((data) => {
        if (mounted) setAlbums(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err?.message || "Не удалось загрузить альбомы"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  // ===== Уникальные жанры =====
  const genres = useMemo(() => {
    const set = new Set<string>();
    albums.forEach((album) => album.genre && set.add(album.genre));
    return ["All", ...Array.from(set).sort()];
  }, [albums]);

  // ===== Фильтрация и сортировка =====
  const filtered = useMemo(() => {
    let list = albums.filter((album) => {
      const matchesSearch = album.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "All" || album.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    if (sortOption === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "newest") {
      list = [...list].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return list;
  }, [albums, searchQuery, selectedGenre, sortOption]);

  // ===== Пагинация =====
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">

      {/* ===== Основной контент ===== */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <Music className="w-7 h-7 text-indigo-500" />
              Explore Albums
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Discover your next favorite album.
            </p>
          </div>

          {/* Поиск, фильтр и сортировка */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm w-full sm:w-auto">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm"
              >
                {genres.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm"
              >
                <option value="name">By Name</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </header>

        {/* ===== Состояния ===== */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/60 dark:bg-gray-800/60 h-60"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-20">
            No albums found. Try another search.
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {paginated.map((album) => (
                <Link
                  key={album.id}
                  href={`/albums/${album.slug ?? album.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg hover:shadow-xl transition"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={album.cover || "/default-album.png"}
                      alt={album.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">
                      {album.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {album.genre || "Unknown Genre"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Released:{" "}
                      {album.created_at
                        ? new Date(album.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tracks: {album.tracks_count || 0}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* ===== Навигация страниц ===== */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className={`p-2 rounded-full border ${
                  page === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-indigo-500 hover:text-white"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={page === totalPages}
                className={`p-2 rounded-full border ${
                  page === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-indigo-500 hover:text-white"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </main>

      {/* ===== Футер ===== */}
      <footer className="mt-auto py-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} SoundVibe — Discover. Listen. Enjoy.
      </footer>
    </div>
  );
}
