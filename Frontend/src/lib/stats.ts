// lib/stats.ts
import api from "@/lib/api";
import type { ListeningHistoryResponse } from "@/types/statsTypes";

// Получение истории прослушиваний
export async function getListeningHistory(page = 1, pageSize = 20): Promise<ListeningHistoryResponse> {
  try {
    const { data } = await api.get<ListeningHistoryResponse>(
      `/musics/history/?page=${page}&page_size=${pageSize}`
    );
    return data;
  } catch (error: any) {
    console.error("Ошибка при загрузке истории:", error.response?.data || error.message);
    throw new Error("Не удалось загрузить историю");
  }
}
