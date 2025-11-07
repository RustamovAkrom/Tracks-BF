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
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!search.trim()) setFiltered(artists);
    else {
      const query = search.toLowerCase();
      setFiltered(
        artists.filter(
          a => a.name.toLowerCase().includes(query) || a.slug.toLowerCase().includes(query)
        )
      );
    }
  }, [search, artists]);

  const gradientBg = "bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800";

  return (
    <div className={`min-h-screen ${gradientBg} flex justify-center px-6 py-10 transition-colors duration-300`}>

      <div className="w-full max-w-6xl backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-2xl p-6 flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text mb-4">
            Featured Artists
          </h1>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search artist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 
                         bg-white/50 dark:bg-zinc-900/50 text-gray-900 dark:text-gray-100 
                         focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center p-6 bg-red-100/50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Artists List */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 dark:text-gray-400 py-20"
            >
              No artists found.
            </motion.div>
          ) : (
            <motion.div key="list" layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
                               hover:bg-white dark:hover:bg-zinc-700/70 rounded-2xl p-4 shadow-sm hover:shadow-lg 
                               transition-all transform hover:-translate-y-1"
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
    </div>
  );
}
