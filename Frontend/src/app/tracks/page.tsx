// app/tracks/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getTracks, likeTrack, playTrack } from "@/lib/tracks";
import type { Track } from "@/types/tracksTypes";
import SearchFilter from "@/components/common/SearchFilter";
import ControlsBar from "@/components/common/ControlsBar";
import TracksTable from "@/components/tracks/TracksTable";
import Sidebar from "@/components/sidebar/Sidebar";
import AudioPlayer from "@/components/player/AudioPlayer";
import { formatTime } from "@/utils/formatTime";

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<number>(0); // 0: no repeat, 1: repeat all, 2: repeat one
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [volumeInitialized, setVolumeInitialized] = useState(false);
  const [likedInitialized, setLikedInitialized] = useState(false);

  // Audio ref for direct control
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize volume from localStorage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("volume");
      if (saved) {
        setVolume(parseFloat(saved));
      }
      setVolumeInitialized(true);
    }
  }, []);

  // Initialize liked tracks from localStorage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("likedTracks");
      if (saved) {
        setLikedTracks(new Set(JSON.parse(saved)));
      }
      setLikedInitialized(true);
    }
  }, []);

  // Save volume to localStorage
  useEffect(() => {
    if (volumeInitialized && typeof window !== "undefined") {
      localStorage.setItem("volume", volume.toString());
    }
  }, [volume, volumeInitialized]);

  // Save liked tracks
  useEffect(() => {
    if (likedInitialized && typeof window !== "undefined") {
      localStorage.setItem("likedTracks", JSON.stringify(Array.from(likedTracks)));
    }
  }, [likedTracks, likedInitialized]);

  // Load tracks
  useEffect(() => {
    getTracks()
      .then((data) => {
        setTracks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Filtered tracks
  const filteredTracks = useMemo(() => 
    tracks.filter((track: Track) => {
      const matchesSearch = track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           track.artist_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === "All" || track.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    }),
    [tracks, searchQuery, selectedGenre]
  );

  // Unique genres
  const genres = useMemo(() => 
    ["All", ...Array.from(new Set(tracks.map((track: Track) => track.genre)))],
    [tracks]
  );

  // Handle play/pause
  const handlePlay = useCallback(async (track: Track): Promise<void> => {
    if (currentTrack?.id === track.id && isPlaying) {
      // Pause
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    // Switch track
    setCurrentTrack(track);
    setIsPlaying(true);

    try {
      await playTrack(track.id);
      setTracks((prev) =>
        prev.map((t) =>
          t.id === track.id ? { ...t, plays_count: t.plays_count + 1 } : t
        )
      );
      setCurrentTime(0);
      setProgress(0);
      if (audioRef.current) {
        audioRef.current.src = track.audio;
        audioRef.current.load();
        audioRef.current.play().catch((err) => {
          console.error("Автовоспроизведение заблокировано:", err);
          setIsPlaying(false);
        });
      }
    } catch (err) {
      console.error("Ошибка play:", err);
      setIsPlaying(false);
    }
  }, [currentTrack?.id, isPlaying]);

  // Handle like
  const handleLike = useCallback(async (track: Track): Promise<void> => {
    try {
      await likeTrack(track.id);
      const wasLiked = likedTracks.has(track.id);
      setLikedTracks((prev) => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.delete(track.id);
        } else {
          newSet.add(track.id);
        }
        return newSet;
      });

      setTracks((prev) =>
        prev.map((t) =>
          t.id === track.id
            ? { 
                ...t, 
                likes_count: wasLiked ? t.likes_count - 1 : t.likes_count + 1 
              }
            : t
        )
      );
    } catch (err) {
      console.error("Ошибка like:", err);
    }
  }, [likedTracks]);

  // Handle play/pause toggle
  const handlePlayPause = useCallback(() => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [currentTrack, isPlaying]);

  // Handle next track
  const handleNext = useCallback(() => {
    if (!currentTrack || filteredTracks.length === 0) return;
    const currentIndex = filteredTracks.findIndex((t) => t.id === currentTrack.id);
    let nextIndex = (currentIndex + 1) % filteredTracks.length;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * filteredTracks.length);
    }
    handlePlay(filteredTracks[nextIndex]);
  }, [currentTrack, filteredTracks, isShuffled, handlePlay]);

  // Handle previous track
  const handlePrevious = useCallback(() => {
    if (!currentTrack || filteredTracks.length === 0) return;
    const currentIndex = filteredTracks.findIndex((t) => t.id === currentTrack.id);
    let prevIndex = currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * filteredTracks.length);
    }
    handlePlay(filteredTracks[prevIndex]);
  }, [currentTrack, filteredTracks, isShuffled, handlePlay]);

  // Handle seek
  const handleSeek = useCallback((percent: number) => {
    if (!currentTrack || !audioRef.current) return;
    const newTime = (percent / 100) * currentTrack.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percent);
  }, [currentTrack]);

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => setIsShuffled(!isShuffled), [isShuffled]);

  // Toggle repeat
  const toggleRepeat = useCallback(() => setRepeatMode((prev) => (prev + 1) % 3), []);

  // Play all
  const playAll = useCallback(() => {
    if (filteredTracks.length > 0) {
      handlePlay(filteredTracks[0]);
    }
  }, [filteredTracks, handlePlay]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio && currentTrack) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / currentTrack.duration) * 100);
      }
    };

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);
    const handleEnded = () => {
      if (repeatMode === 2) {
        // Repeat one
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 1) {
        // Repeat all
        handleNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlayEvent);
    audio.addEventListener("pause", handlePauseEvent);
    audio.addEventListener("ended", handleEnded);

    // Set volume on mount
    audio.volume = volume;

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlayEvent);
      audio.removeEventListener("pause", handlePauseEvent);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack, volume, repeatMode, handleNext]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black text-white flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black text-white pb-24 sm:pb-0 mt-15">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/60 backdrop-blur-md p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            genres={genres}
          />
          <ControlsBar
            onPlayAll={playAll}
            isShuffled={isShuffled}
            onToggleShuffle={toggleShuffle}
            filteredTracks={filteredTracks}
          />
        </div>
      </header>

<div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6 pb-6">
  {/* Main Content */}
  <main className="flex-1">
    <TracksTable
      tracks={tracks}
      filteredTracks={filteredTracks}
      currentTrack={currentTrack}
      likedTracks={likedTracks}
      onPlay={handlePlay}
      onLike={handleLike}
    />
  </main>

  {/* Sidebar (desktop only) */}
  <aside className="hidden lg:block w-80 shrink-0">
    <Sidebar
      currentTrack={currentTrack}
      currentTime={currentTime}
      progress={progress}
      onSeek={handleSeek}
      likedTracks={likedTracks}
      onLike={handleLike}
      tracks={tracks}
      onPlay={handlePlay}
    />
  </aside>
</div>


      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" className="hidden" />

      {/* Player UI */}
      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        progress={progress}
        volume={volume}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
        likedTracks={likedTracks}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onLike={handleLike}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
      />
    </div>
  );
}