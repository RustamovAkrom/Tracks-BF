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

// ❌ Было delete by ID → ✅ теперь delete by slug
export async function deleteListeningHistoryItem(slug: string): Promise<void> {
  try {
    await api.delete(`/musics/history/${slug}/`);
  } catch (error: any) {
    console.error("Ошибка при удалении элемента истории:", error.response?.data || error.message);
    throw new Error("Не удалось удалить элемент истории");
  }
}

// ✅ Исправлено: backend возвращает 204 → axios не может распарсить пустой ответ
export async function clearListeningHistory(): Promise<void> {
  try {
    await api.delete("/musics/history/clear/", { data: {} });
  } catch (error: any) {
    console.error("Ошибка при очистке истории:", error.response?.data || error.message);
    throw new Error("Не удалось очистить историю");
  }
}

// ✅ Получение истории по слагу (не по id)
export async function getHistoryBySlug(slug: string): Promise<ListeningHistoryResponse> {
  try {
    const { data } = await api.get<ListeningHistoryResponse>(
      `/musics/history/${slug}/`
    );
    return data;
  } catch (error: any) {
    console.error("Ошибка при загрузке истории по слагу:", error.response?.data || error.message);
    throw new Error("Не удалось загрузить историю по слагу");
  }
}
