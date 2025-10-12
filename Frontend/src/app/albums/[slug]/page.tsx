// app/albums/[slug]/page.tsx
import { getAlbum } from "@/lib/albums";
import Image from "next/image";
import Link from "next/link";
import { Music, Play } from "lucide-react";

interface AlbumDetailPageProps {
  params: { slug: string };
}

export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  try {
    const album = await getAlbum(params.slug);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-16">
        {/* ===== Header Section ===== */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative w-56 h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={album.cover || "/default-album.png"}
              alt={album.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">{album.name}</h1>

            <Link
              href={`/artists/${album.artist.slug}`}
              className="text-indigo-500 hover:underline text-lg font-medium"
            >
              {album.artist.name}
            </Link>

            {album.release_date && (
              <p className="text-gray-500">
                Released:{" "}
                {new Date(album.release_date).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2">
              <Music className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">
                {album.tracks.length}{" "}
                {album.tracks.length === 1 ? "track" : "tracks"}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Tracks Section ===== */}
        <div>
          <h2 className="text-xl font-semibold mb-5">Tracks</h2>

          {album.tracks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tracks available.</p>
          ) : (
            <ul className="space-y-4">
              {album.tracks.map((track) => (
                <li
                  key={track.id}
                  className="flex items-center justify-between bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-md overflow-hidden">
                      <Image
                        src={track.cover || "/default-track.png"}
                        alt={track.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <p className="font-medium text-base">{track.name}</p>
                      <p className="text-sm text-gray-500">
                        {track.genre || "Unknown genre"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      {formatDuration(track.duration)}
                    </span>

                    <Link
                      href={track.audio}
                      target="_blank"
                      className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition"
                    >
                      <Play className="w-4 h-4" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-bold mb-2">Album not found</h1>
        <p className="text-gray-500">
          The album you are looking for does not exist.
        </p>
      </div>
    );
  }
}

/** Helper: форматирует duration из секунд/миллисекунд в mm:ss */
function formatDuration(duration: number) {
  if (!duration || duration <= 0) return "0:00";

  // Иногда API возвращает duration в наносекундах (очень большое число)
  let seconds =
    duration > 100000 ? Math.floor(duration / 1_000_000_000) : duration;

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
