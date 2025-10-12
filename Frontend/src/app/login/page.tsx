"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import config from "@/config/config.site";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // очищаем ошибку конкретного поля
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // блокируем дефолтный сабмит
    setErrors({}); // очищаем предыдущие ошибки
    setLoading(true);

    try {
      await login(form);
      // редирект только после успешного входа
      window.location.href = "/";
    } catch (err: any) {
      const newErrors: { [key: string]: string } = {};

      if (err?.response?.data) {
        const data = err.response.data;
        for (const key in data) {
          if (Array.isArray(data[key])) newErrors[key] = data[key][0];
          else if (typeof data[key] === "string") newErrors[key] = data[key];
        }
      } else {
        newErrors.detail = "Произошла неизвестная ошибка.";
      }

      setErrors(newErrors);

      // ❌ сохраняем сообщение хотя бы 5 секунд
      setTimeout(() => setErrors({}), 5000);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Вход в аккаунт
        </h1>

        <div className="flex flex-col gap-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          {errors.detail && (
            <p className="text-red-500 text-sm font-medium text-center">{errors.detail}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-md transition"
          >
            {loading ? "Вход..." : "Войти"}
          </button>

          <button
            type="button"
            onClick={() => window.location.href = `${config.api.baseUrl}/users/social-auth/auth/google/`}
            className="w-full p-3 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white shadow-md transition flex items-center justify-center gap-2"
          >
            Войти через Google
          </button>
        </div>
      </form>
    </div>
  );
}
