import api from "@/lib/api";
import { TrackType } from "@/types/tracksTypes";

export async function getTracks(): Promise<TrackType[]> {
  const { data } = await api.get("/musics/tracks/");
  return data;
  // return Array.isArray(data.results) ? data.results : [];
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

// Получение похожих треков
export async function getSimilarTracks(slug: string): Promise<TrackType[]> {
  const { data } = await api.get(`/musics/tracks/${slug}/similar/`);
  return data;
}

export async function likeTrack(slug: string) {
  const { data } = await api.post(`/musics/tracks/${slug}/like/`);
  return data;
}


export async function PlayTrack(slug: string) {
  const { data } = await api.post(`/musics/tracks/${slug}/play/`);
  return data;
}
