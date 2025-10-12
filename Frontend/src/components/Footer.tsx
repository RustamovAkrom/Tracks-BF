"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-600 dark:text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Лого */}
        <Link
          href="/"
          className="font-bold text-lg tracking-wide text-gray-900 dark:text-gray-100"
        >
          🎵 MyMusic
        </Link>

        {/* Навигация */}
        <div className="flex gap-6 text-sm">
          <Link
            href="/about"
            className="hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors"
          >
            Privacy
          </Link>
        </div>

        {/* Копирайт */}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} MyMusic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
