import type { AlbumType } from "./albumsTypes";

export type ArtistsType = {
  id: number;
  name: string;
  slug: string;
  avatar: string | null;
  albums_count: number;
  created_at: string;
  updated_at: string;
};

export type ArtistType = {
  id: number;
  name: string;
  slug: string;
  owner: number;
  bio: string | null;
  avatar: string | null;
  meta: string | null;
  albums: AlbumType[];
};