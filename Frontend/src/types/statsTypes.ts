// Один трек внутри истории
import { TrackType } from "./tracksTypes";

// Один элемент истории прослушиваний
export interface ListeningHistoryItemType {
  id: number;
  track: TrackType;
  listened_at: string;
  duration?: number;
  additional_info?: string | null;
}

// Общий тип для пагинированного ответа
export interface ListeningHistoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListeningHistoryItemType[];
}
