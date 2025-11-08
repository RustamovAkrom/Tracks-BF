"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getListeningHistory } from "@/lib/stats";
import type { ListeningHistoryItemType } from "@/types/statsTypes";
import { Headphones } from "lucide-react";

export default function ListeningHistoryPage() {
  const [history, setHistory] = useState<ListeningHistoryItemType[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🚀 Оптимизированный запрос с защитой от повторных вызовов
  useEffect(() => {
    let ignore = false;
    async function fetchHistory() {
      try {
        setLoading(true);
        const data = await getListeningHistory(pageNumber);
        if (!ignore) {
          setHistory((prev) => [...prev, ...data.results]);
          setHasMore(Boolean(data.next));
        }
      } catch (err) {
        console.error("Ошибка загрузки истории:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchHistory();
    return () => {
      ignore = true;
    };
  }, [pageNumber]);

  return (
    <div className="min-h-screen flex justify-center px-6 py-10 bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="w-full max-w-6xl">
        {/* Заголовок */}
        <h1 className="text-3xl font-bold mb-8 text-center text-zinc-900 dark:text-zinc-100">
          История прослушиваний
        </h1>

        {/* Пустое состояние */}
        {history.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500 dark:text-zinc-400">
            <Headphones size={50} className="mb-3 opacity-70" />
            <p className="text-lg font-medium">История пуста</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((item) => (
              <li
                key={item.id}
                className="group bg-zinc-50 dark:bg-zinc-800 rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Link href={`/tracks/${item.track.slug}`} className="block">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={item.track.cover || "/default-cover.jpg"}
                      alt={item.track.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    />
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {item.track.name}
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                      {item.track.artist?.name || "Неизвестный исполнитель"}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Прослушано:{" "}
                      {new Date(item.listened_at).toLocaleString("ru-RU", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Кнопка загрузки */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPageNumber((prev) => prev + 1)}
              className="px-6 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-90 transition"
            >
              Загрузить ещё
            </button>
          </div>
        )}

        {/* Индикатор загрузки */}
        {loading && (
          <p className="text-center mt-6 text-zinc-500 dark:text-zinc-400 animate-pulse">
            Загрузка...
          </p>
        )}
      </div>
    </div>
  );
}
