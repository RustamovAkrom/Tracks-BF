"use client";

import { useEffect, useState } from "react";
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
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      artists.filter(
        (a) => a.name.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q)
      )
    );
  }, [search, artists]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Header / Search */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Artists
          </h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search artist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Error / Loading */}
        {error && (
          <div className="text-center text-red-600 dark:text-red-400">{error}</div>
        )}
        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        )}

        {/* Artists Grid */}
        <AnimatePresence mode="popLayout">
          {!loading && filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 dark:text-gray-400 py-20"
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="group flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-200 dark:border-gray-700 group-hover:border-indigo-500 transition-colors">
                      <Image
                        src={artist.avatar || "/default-avatar.png"}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-md font-semibold truncate text-gray-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                      {artist.name}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {artist.albums_count} album{artist.albums_count !== 1 ? "s" : ""}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
