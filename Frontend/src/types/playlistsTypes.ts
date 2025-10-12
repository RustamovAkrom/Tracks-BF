// src/types/playlistsTypes.ts

/** Упрощённый трек внутри плейлиста (используется в деталях) */
export type TrackInPlaylistType = {
  id: number;
  name: string;
  duration: number; // в секундах или миллисекундах
};

/** Трек в плейлисте с порядком */
export type PlaylistTrackType = {
  id: number;
  order: number;
  track: TrackInPlaylistType;
};

/** Тип для списка плейлистов */
export type PlaylistsType = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_public: boolean;
  owner: string; // username или name (StringRelatedField)
  tracks_count: number;
  created_at: string;
  updated_at: string;
};

/** Тип для детальной информации о плейлисте */
export type PlaylistType = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_public: boolean;
  owner: string;
  tracks: PlaylistTrackType[]; // треки с порядком
  created_at: string;
  updated_at: string;
};

/** Тип для создания или обновления плейлиста */
export type PlaylistCreateUpdateType = {
  id?: number;
  name: string;
  description?: string;
  is_public?: boolean;
  track_ids?: number[]; // массив ID треков
};
