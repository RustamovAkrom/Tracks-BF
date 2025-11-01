// src/components/AudioPlayer.tsx
"use client";
import { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  src: string;       // ссылка на аудио-файл
  title?: string;    // название трека (необязательно)
  cover?: string;    // обложка (необязательно)
}

export default function AudioPlayer({ src, title, cover }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((current / duration) * 100 || 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = (clickX / width) * duration;
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className="w-full p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-md flex items-center gap-4">
      {cover && (
        <img
          src={cover}
          alt={title}
          className="w-12 h-12 rounded-md object-cover"
        />
      )}

      <div className="flex-1">
        {title && <p className="font-medium text-sm mb-1">{title}</p>}

        <div
          className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-blue-500 dark:bg-blue-400 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={togglePlay}
        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
      >
        {isPlaying ? "⏸ Pause" : "▶️ Play"}
      </button>

      <audio
        src={src}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
