"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  // Опционально: авто-редирект через 10 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 px-4">
      
      <div className="flex flex-col items-center gap-6 text-center">
        <AlertCircle className="w-20 h-20 text-red-500 animate-pulse" />
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Oops! Page not found</h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex gap-4 mt-6">
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition transform hover:scale-105"
          >
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg font-medium transition transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
