"use client";

import { Search, Filter } from "lucide-react";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: string[];
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent flex-shrink-0">
        🎵 Треки
      </h1>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск треков, исполнителей..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-gray-800 rounded-full pl-10 pr-4 py-2 w-full sm:w-64 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>
        <div className="relative flex-1 sm:flex-none">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="bg-gray-800 rounded-full pl-10 pr-8 py-2 w-full sm:w-32 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none transition-all"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}