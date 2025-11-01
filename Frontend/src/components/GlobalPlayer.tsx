// src/components/GlobalPlayer.tsx
"use client";
import { useState, useMemo } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

function formatTime(seconds: number) {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    toggle,
    playNext,
    playPrev,
    progress,
    duration,
    setVolume,
    audioRef,
  } = usePlayer();

  const [expanded, setExpanded] = useState(false);
  const [localVolume, setLocalVolume] = useState(1);

  if (!currentTrack) return null;

  const progressPercent = Math.max(0, Math.min(100, Math.round(progress * 100)));

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * (duration || 0);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const onVolumeChange = (value: number) => {
    setLocalVolume(value);
    setVolume(value);
  };

  return (
    <>
      {/* mini bar */}
      <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-50">
        <div
          className="bg-white/5 backdrop-blur-md text-white rounded-2xl shadow-lg p-3 flex items-center gap-4"
          role="region"
          aria-label="Global player"
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.name}
            className="w-12 h-12 rounded-md object-cover"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="truncate">
                <div className="font-medium truncate">{currentTrack.name}</div>
                <div className="text-xs text-gray-300 truncate">{currentTrack.genre}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => playPrev()}
                  className="p-2 rounded hover:bg-white/10"
                  aria-label="Previous"
                >
                  <SkipBack size={16} />
                </button>

                <button
                  onClick={toggle}
                  className="p-2 rounded bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button
                  onClick={() => playNext()}
                  className="p-2 rounded hover:bg-white/10"
                  aria-label="Next"
                >
                  <SkipForward size={16} />
                </button>

                <button
                  onClick={() => setExpanded(true)}
                  className="p-2 rounded hover:bg-white/10"
                  aria-label="Open player"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7"/></svg>
                </button>
              </div>
            </div>

            <div className="mt-2">
              <div
                className="w-full h-2 bg-white/20 rounded cursor-pointer"
                onClick={handleSeekClick}
              >
                <div
                  className="h-full bg-indigo-500 rounded"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">
              <span className="min-w-[36px] text-right tabular-nums">{formatTime(progress * duration)}</span>
              <span className="text-xs">/</span>
              <span className="min-w-[36px] text-left tabular-nums">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 size={16} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={localVolume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>

      {/* expanded overlay */}
      {expanded && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-900 w-full md:w-3/4 rounded-t-2xl p-6">
            <div className="flex items-start gap-4">
              <img src={currentTrack.cover} alt={currentTrack.name} className="w-36 h-36 rounded-md object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{currentTrack.name}</h3>
                    <p className="text-sm text-gray-500">{currentTrack.genre}</p>
                  </div>
                  <button onClick={() => setExpanded(false)} className="p-2 rounded hover:bg-gray-100">
                    <X size={20}/>
                  </button>
                </div>

                <div className="mt-6">
                  <div
                    className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded cursor-pointer"
                    onClick={handleSeekClick}
                  >
                    <div
                      className="h-full bg-indigo-500 rounded"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => playPrev()} className="p-2 rounded hover:bg-gray-100">
                        <SkipBack size={20} />
                      </button>
                      <button onClick={toggle} className="px-4 py-2 rounded-full bg-indigo-600 text-white">
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button onClick={() => playNext()} className="p-2 rounded hover:bg-gray-100">
                        <SkipForward size={20} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      <Volume2 />
                      <input type="range" min={0} max={1} step={0.01} value={localVolume} onChange={(e) => onVolumeChange(parseFloat(e.target.value))} />
                    </div>
                  </div>

                  <div className="mt-6">
                    {/* queue preview */}
                    <h4 className="text-sm text-gray-500 mb-2">Up next</h4>
                    <ol className="space-y-2 max-h-40 overflow-auto">
                      {/* queue rendering omitted because access to queue from context is optional here;
                          you can show it by pulling queue from usePlayer if needed */}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
