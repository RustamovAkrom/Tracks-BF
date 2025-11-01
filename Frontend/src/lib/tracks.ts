// src/lib/tracks.ts
import api from "@/lib/api";
import { TrackType } from "@/types/tracksTypes";

export async function getTracks(): Promise<TrackType[]> {
  const { data } = await api.get("/musics/tracks/");
  // API returns { count, next, previous, results: TrackType[] }
  return Array.isArray(data.results) ? data.results : [];
}

export async function getTrackBySlug(slug: string): Promise<TrackType | null> {
  try {
    const { data } = await api.get(`/musics/tracks/${slug}/`);
    return data;
  } catch (error) {
    console.error("Error fetching track by slug:", error);
    return null;
  }
}

// This function calls backend to like a track

export async function likeTrack(id: number) {
  const { data } = await api.post(`/musics/tracks/${id}/like/`);
  return data;
}

// This function calls backend to increment plays_count
export async function postPlayCount(id: number) {
  const { data } = await api.post(`/musics/tracks/${id}/play/`);
  return data;
}


