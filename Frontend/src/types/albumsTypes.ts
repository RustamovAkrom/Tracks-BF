import { TrackType } from "./tracksTypes";
import { ArtistType } from "./artistsTypes";

export type AlbumsType = {
  id: number;
  name: string;
  slug: string;
  cover: string | null;
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
}