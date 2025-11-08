"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import config from "@/config/config.site";
import Link from "next/link";


export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await login(form);
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
      setTimeout(() => setErrors({}), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 rounded-3xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Enter your credentials to access your music space. <br />
          {`Don't have an account? `}
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Register here
          </Link>
        </p>

        <div className="flex flex-col gap-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          {errors.detail && (
            <p className="text-red-500 text-sm font-medium text-center">{errors.detail}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white shadow-lg transition transform hover:scale-105"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => window.location.href = `${config.api.baseUrl}/users/social-auth/auth/google/`}
            className="w-full p-4 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg transition flex items-center justify-center gap-3 transform hover:scale-105"
          >
            Login with Google
          </button>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Forgot your password?{" "}
            <a href="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
              Reset here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
