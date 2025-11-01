// src/app/tracks/[slug]/page.tsx
import { getTrackBySlug } from "@/lib/tracks";
import { notFound } from "next/navigation";
import { Play, Heart, Headphones } from "lucide-react";
import TrackPlayerSection from "./TrackPlayerSection";

interface TrackDetailPageProps {
  params: { slug: string };
}

export default async function TrackDetail({ params }: TrackDetailPageProps) {
  const track = await getTrackBySlug(params.slug);

  if (!track) return notFound(); // Next.js built-in 404

  return (
    <div className="max-w-3xl mx-auto mt-24 px-6 pb-20">
      <img
        src={track.cover}
        alt={track.name}
        className="w-full h-72 object-cover rounded-2xl shadow-lg"
      />

      <h1 className="text-4xl font-bold mt-6">{track.name}</h1>
      <p className="text-lg text-gray-400 mt-1">{track.genre}</p>

      <div className="flex gap-6 mt-4 text-gray-500 dark:text-gray-300">
        <span className="flex items-center gap-1">
          <Headphones size={18} /> {track.plays_count}
        </span>
        <span className="flex items-center gap-1">
          <Heart size={18} /> {track.likes_count}
        </span>
      </div>

      {/* CLIENT COMPONENT with Play + Like buttons */}
      <TrackPlayerSection track={track} />
    </div>
  );
}
