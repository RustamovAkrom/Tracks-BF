// lib/tracks.ts
import api from "@/lib/api";
import { TrackType } from "@/types/tracksTypes";

export async function getTracks(): Promise<TrackType[]> {
  const { data } = await api.get<TrackType[]>("/musics/tracks/");
  return data;
}

export async function likeTrack(id: number) {
  const { data } = await api.post(`/musics/tracks/${id}/like/`);
  return data;
}

export async function playTrack(id: number) {
  const { data } = await api.post(`/musics/tracks/${id}/play/`);
  return data;
}
