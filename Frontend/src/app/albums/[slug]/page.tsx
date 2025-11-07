"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Music } from "lucide-react";
import { getAlbum } from "@/lib/albums";
import { TrackType } from "@/types/tracksTypes";
import { TrackCard } from "@/components/TrackCard";

interface AlbumDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // unwrap params
  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    })();
  }, [params]);

  // fetch album
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

  if (loading) return <p className="text-center mt-20 text-gray-700 dark:text-gray-300 animate-pulse">Загрузка альбома...</p>;
  if (!album) return <p className="text-center mt-20 text-red-500">Альбом не найден</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300 flex justify-center">

      {/* Внутренний слой с blur */}
      <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 w-full flex flex-col items-center px-6 py-10">

        {/* Контейнер */}
        <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 mt-20 mb-16">

          {/* ===== Album Header ===== */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="relative w-56 h-56 md:w-72 md:h-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg">
              <Image src={album.cover || "/default-album.png"} alt={album.name} fill className="object-cover" />
            </div>

            <div className="flex flex-col gap-3 text-center md:text-left md:flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{album.name}</h1>

              <Link href={`/artists/${album.artist.slug}`} className="text-indigo-500 hover:underline text-lg font-medium">
                {album.artist.name}
              </Link>

              {album.release_date && (
                <p className="text-gray-500">Released: {new Date(album.release_date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>
              )}

              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <Music className="w-4 h-4" />
                <p className="text-sm">{album.tracks.length} {album.tracks.length === 1 ? "track" : "tracks"}</p>
              </div>
            </div>
          </div>

          {/* ===== Tracks List ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {album.tracks.map((track: TrackType) => (
              <TrackCard key={track.id} track={track} allTracks={album.tracks} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
