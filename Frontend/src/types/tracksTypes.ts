export interface TrackType {
  id: number;
  name: string;
  duration: number;
  audio: string;
  cover: string;
  plays_count: number;
  likes_count: number;
  is_liked?: boolean;
  genre: string;
  slug: string;
  artist_name: string;
  album_name: string;
  is_published: boolean;
  likedByUser?: boolean;
}
