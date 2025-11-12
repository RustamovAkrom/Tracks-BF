import { TrackType } from "./tracksTypes";
import { ArtistType } from "./artistsTypes";

export type AlbumsType = {
  id: number;
  name: string;
  slug: string;
  cover: string | null;
  tracks_count: number;
  created_at: string;
};

export type AlbumType = {
  id: number;
  name: string;
  slug: string;
  owner: number;
  artist: ArtistType;
  release_date: string | null;
  cover: string | null;
  is_published: boolean;
  tracks: TrackType[];
  tracks_count: number;
  created_at: string;
  updated_at: string;
}