"use client";

import { useState } from "react";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  // ошибки теперь храним объектом: { username: "...", email: "...", ... }
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // очищаем ошибку при вводе
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.password2) {
      setErrors({ password2: "Пароли не совпадают" });
      return;
    }

    try {
      await register(form);
      alert("Регистрация успешна! Проверьте почту для активации аккаунта.");
      window.location.href = "/login";
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);

      // 🔹 Axios всегда кладёт тело ошибки в err.response.data
      const responseErrors = err?.response?.data;

      if (responseErrors && typeof responseErrors === "object") {
        const newErrors: { [key: string]: string } = {};
        for (const key in responseErrors) {
          if (Array.isArray(responseErrors[key])) {
            newErrors[key] = responseErrors[key][0]; // берём первую ошибку
          } else if (typeof responseErrors[key] === "string") {
            newErrors[key] = responseErrors[key];
          }
        }
        setErrors(newErrors);
      } else {
        setErrors({ detail: "Произошла неизвестная ошибка, попробуйте ещё раз" });
      }
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Регистрация
        </h1>

        <div className="flex flex-col gap-4">
          <div>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password2"
              value={form.password2}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
            />
            {errors.password2 && (
              <p className="text-red-500 text-sm mt-1">{errors.password2}</p>
            )}
          </div>

          {errors.detail && (
            <p className="text-red-500 text-sm font-medium text-center">{errors.detail}</p>
          )}

          <button
            type="submit"
            className="w-full p-3 rounded-lg font-medium bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white shadow-md transition"
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
  );
}
