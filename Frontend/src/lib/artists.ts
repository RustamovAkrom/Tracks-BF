// lib/artists.ts
import api from "@/lib/api";
import type { ArtistsType, ArtistType } from "@/types/artistsTypes";

// Получить список артистов
export async function getArtists(): Promise<ArtistsType[]> {
  const { data } = await api.get<ArtistsType[]>("/musics/artists/");
  return data;
}

// Получить артиста по slug
export async function getArtist(slug: string): Promise<ArtistType> {
  const { data } = await api.get<ArtistType>(`/musics/artists/${slug}/`);
  return data;
}
