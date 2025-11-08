"use client";

import { useState } from "react";
import { register } from "@/lib/auth";
import Link from "next/link";
import config from "@/config/config.site";


export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.password2) {
      setErrors({ password2: "Пароли не совпадают" });
      return;
    }

    setLoading(true);
    try {
      await register(form);
      alert("Регистрация успешна! Проверьте почту для активации аккаунта.");
      window.location.href = "/login";
    } catch (err: any) {
      const responseErrors = err?.response?.data;
      if (responseErrors && typeof responseErrors === "object") {
        const newErrors: { [key: string]: string } = {};
        for (const key in responseErrors) {
          if (Array.isArray(responseErrors[key])) {
            newErrors[key] = responseErrors[key][0];
          } else if (typeof responseErrors[key] === "string") {
            newErrors[key] = responseErrors[key];
          }
        }
        setErrors(newErrors);
      } else {
        setErrors({ detail: "Произошла неизвестная ошибка, попробуйте ещё раз" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-3xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all"
      >
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          Create Your Account
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Join our music community and unlock unlimited access to tracks, playlists, and artists. <br />
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Login here
          </Link>
        </p>

        <div className="flex flex-col gap-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          <input
            type="password"
            name="password2"
            value={form.password2}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
          />
          {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2}</p>}

          {errors.detail && <p className="text-red-500 text-sm font-medium text-center">{errors.detail}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl font-semibold bg-green-600 hover:bg-green-700 disabled:bg-green-400 dark:bg-green-500 dark:hover:bg-green-600 text-white shadow-lg transition transform hover:scale-105"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <button
            type="button"
            onClick={() => window.location.href = `${config.api.baseUrl}/users/social-auth/auth/google/`}
            className="w-full p-4 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg transition flex items-center justify-center gap-3 transform hover:scale-105"
          >
            Register with Google
          </button>
        </div>
      </form>
    </div>
  );
}
