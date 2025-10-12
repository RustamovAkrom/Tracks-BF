import { getArtist } from "@/lib/artists";
import Image from "next/image";
import Link from "next/link";
import { Disc, Info } from "lucide-react";
import type { ArtistType } from "@/types/artistsTypes";

interface ArtistDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtistDetailPage(props: ArtistDetailPageProps) {
  const { slug } = await props.params;

  try {
    const artist: ArtistType = await getArtist(slug);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-16">
        {/* ===== Header Section ===== */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative w-56 h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={artist.avatar || "/default-artist.png"}
              alt={artist.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">{artist.name}</h1>

            {artist.meta && typeof artist.meta === "string" && (
              <p className="text-gray-500 text-sm italic">{artist.meta}</p>
            )}

            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <Info className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">
                Total albums: {artist.albums?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Bio Section ===== */}
        {artist.bio && typeof artist.bio === "string" && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {artist.bio}
            </p>
          </div>
        )}

        {/* ===== Albums Section ===== */}
        <div>
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <Disc className="w-5 h-5 text-indigo-500" /> Albums
          </h2>

          {artist.albums && artist.albums.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.albums.map((album) => (
                <li
                  key={album.id}
                  className="group bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition"
                >
                  <Link href={`/albums/${album.slug}`} className="block">
                    <div className="relative w-full h-48">
                      <Image
                        src={album.cover || "/default-album.png"}
                        alt={album.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {album.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {album.release_date
                          ? new Date(album.release_date).getFullYear()
                          : "Unknown year"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No albums found for this artist.</p>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-bold mb-2">Artist not found</h1>
        <p className="text-gray-500">
          The artist you are looking for does not exist.
        </p>
      </div>
    );
  }
}
