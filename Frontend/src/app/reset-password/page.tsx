"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import api from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Если токена нет, сразу показываем ошибку
  useEffect(() => {
    if (!token) {
      setError("❌ Ссылка для сброса пароля недействительна или устарела.");
    }
  }, [token]);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (!newPassword || !confirmPassword) {
      setError("Пожалуйста, заполните оба поля.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Пароль должен содержать минимум 8 символов.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const cleanToken = token?.replace(/\/$/, ""); // если есть слэш в конце
    try {
      await api.post("/users/passwords/reset-password/", {
        token: cleanToken,
        new_password: newPassword,
      });
      setSuccess("✅ Пароль успешно изменён! Перенаправление...");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Произошла ошибка при сбросе пароля. Попробуйте снова."
      );
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">🔑 Сброс пароля</h1>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-center mb-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 dark:text-green-400 text-center mb-4">
            {success}
          </p>
        )}

        {!success && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Новый пароль
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="Введите новый пароль"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Подтвердите пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="Повторите новый пароль"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              {loading ? "Обновление..." : "Сбросить пароль"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
