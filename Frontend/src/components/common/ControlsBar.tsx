// components/common/ControlsBar.tsx
"use client";

import { Play, Shuffle } from "lucide-react";
import { Track } from "@/types/tracksTypes";

interface ControlsBarProps {
  onPlayAll: () => void;
  isShuffled: boolean;
  onToggleShuffle: () => void;
  filteredTracks: Track[];
}

export default function ControlsBar({
  onPlayAll,
  isShuffled,
  onToggleShuffle,
  filteredTracks,
}: ControlsBarProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={onPlayAll}
        disabled={filteredTracks.length === 0}
        className="bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-6 py-2 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 disabled:hover:scale-100"
      >
        <Play className="w-5 h-5" />
        Воспроизвести все
      </button>
      <button
        onClick={onToggleShuffle}
        className={`p-2 rounded-full transition-colors ${isShuffled ? 'text-green-400 bg-green-400/20' : 'text-gray-400 hover:text-white'}`}
        aria-label={isShuffled ? "Выключить shuffle" : "Включить shuffle"}
      >
        <Shuffle className="w-5 h-5" />
      </button>
    </div>
  );
}