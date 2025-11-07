"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Лого */}
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-indigo-600 dark:text-indigo-400 hover:scale-105 transform transition"
        >
          <span className="text-2xl">🎶</span>
          <span className="hidden sm:inline">SoundWave</span>
        </Link>

        {/* Навигация */}
        <div className="flex gap-6 text-sm">
          <Link href="/about" className="footer-link">About</Link>
          <Link href="/contact" className="footer-link">Contact</Link>
          <Link href="/privacy" className="footer-link">Privacy</Link>
        </div>

        {/* Копирайт */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} SoundWave. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        .footer-link {
          position: relative;
          color: inherit;
          transition: all 0.3s ease;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: #6366f1; /* indigo-500 */
          transition: width 0.3s;
        }
        .footer-link:hover::after {
          width: 100%;
        }
        .footer-link:hover {
          color: #4f46e5; /* indigo-600 */
        }
      `}</style>
    </footer>
  );
}
