// lib/albums.ts
import api from "@/lib/api";
import type { AlbumType, AlbumsType } from "@/types/albumsTypes";

// Получить список альбомов
export async function getAlbums(): Promise<AlbumsType[]> {
  const { data } = await api.get<AlbumsType[]>("/musics/albums/");
  return data;
}

// Получить альбом по ID или slug
export async function getAlbum(slug: string): Promise<AlbumType> {
  const { data } = await api.get<AlbumType>(`/musics/albums/${slug}/`);
  return data;
}

