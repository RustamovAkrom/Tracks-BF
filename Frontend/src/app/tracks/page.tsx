"use client";

import { useEffect, useState } from "react";
import { TrackType } from "@/types/tracksTypes";
import { TrackCard } from "@/components/TrackCard";
import { getTracks } from "@/lib/tracks";

const TRACKS_PER_PAGE = 8;

export default function TracksPage() {
  const [allTracks, setAllTracks] = useState<TrackType[]>([]);
  const [visibleTracks, setVisibleTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const data = await getTracks(); // весь массив треков
        setAllTracks(data);
        setVisibleTracks(data.slice(0, TRACKS_PER_PAGE));
      } catch (err) {
        console.error(err);
        setError("Ошибка при загрузке треков");
      } finally {
        setLoading(false);
      }
    };
    loadTracks();
  }, []);

  // фильтрация
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = allTracks.filter(track => {
      const matchesSearch =
        track.name.toLowerCase().includes(lowerSearch) ||
        track.artist.name.toLowerCase().includes(lowerSearch);
      const matchesGenre = genreFilter
        ? track.genres.some(g => g.name.toLowerCase() === genreFilter.toLowerCase())
        : true;
      return matchesSearch && matchesGenre;
    });
    setVisibleTracks(filtered.slice(0, page * TRACKS_PER_PAGE));
  }, [search, genreFilter, allTracks, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const genres = Array.from(new Set(allTracks.flatMap(t => t.genres.map(g => g.name))));

  if (loading) return <p className="text-center mt-10">Загрузка треков...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-7xl mt-6">
        <input
          type="text"
          placeholder="Поиск трека или артиста..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <select
          value={genreFilter}
          onChange={e => setGenreFilter(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Все жанры</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Tracks Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl py-10 mx-auto">
        {visibleTracks.map(track => (
          <TrackCard key={track.id} track={track} allTracks={visibleTracks} />
        ))}
        {visibleTracks.length === 0 && (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
            Треки не найдены
          </p>
        )}
      </div>

      {/* Load More Button */}
      {visibleTracks.length < allTracks.filter(track => {
        const lowerSearch = search.toLowerCase();
        const matchesSearch =
          track.name.toLowerCase().includes(lowerSearch) ||
          track.artist.name.toLowerCase().includes(lowerSearch);
        const matchesGenre = genreFilter
          ? track.genres.some(g => g.name.toLowerCase() === genreFilter.toLowerCase())
          : true;
        return matchesSearch && matchesGenre;
      }).length && (
        <button
          onClick={loadMore}
          className="mb-10 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Загрузить ещё
        </button>
      )}
    </div>
  );
}
