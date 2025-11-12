import type { GenreType } from "./genresTypes";
import type { AlbumType } from "./albumsTypes";
import type { ArtistType } from "./artistsTypes";

export interface TrackType {
  id: number;
  name: string;
  slug: string;
  
  duration: number;
  audio: string;
  cover: string;
  description?: string;

  release_date?: string;
  created_at: string;
  updated_at: string;
  plays_count: number;
  likes_count: number;

  is_liked?: boolean;
  likedByUser?: boolean;

  is_published: boolean;

  genres: GenreType[];
  artist: ArtistType;
  album: AlbumType;
}
