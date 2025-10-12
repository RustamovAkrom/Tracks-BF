// components/sidebar/Sidebar.tsx (updated onLike to handle null)
"use client";

import { Track } from "@/types/tracksTypes";
import { formatTime } from "@/utils/formatTime";
import NowPlaying from "./NowPlaying";
import PopularTracks from "./PopularTracks";
import TopArtists from "./TopArtists";

interface SidebarProps {
  currentTrack: Track | null;
  currentTime: number;
  progress: number;
  onSeek: (percent: number) => void;
  likedTracks: Set<number>;
  onLike: (track: Track) => void;
  tracks: Track[];
  onPlay: (track: Track) => void;
}

export default function Sidebar({
  currentTrack,
  currentTime,
  progress,
  onSeek,
  likedTracks,
  onLike,
  tracks,
  onPlay,
}: SidebarProps) {
  return (
    <aside className="hidden md:block w-80 space-y-6">
      <NowPlaying
        track={currentTrack}
        currentTime={currentTime}
        progress={progress}
        onSeek={onSeek}
        isLiked={currentTrack ? likedTracks.has(currentTrack.id) : false}
        onLike={onLike}
      />
      <PopularTracks tracks={tracks} onPlay={onPlay} />
      <TopArtists tracks={tracks} />
    </aside>
  );
}