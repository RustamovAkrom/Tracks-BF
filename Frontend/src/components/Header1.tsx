"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { logout } from "@/lib/auth";
import { Menu, X } from "lucide-react";
import config from "@/config/config.site";
import { ModeToggle } from "./ThemeToggle";

interface NavbarProps {
  initialAuth: boolean;
}

export default function Navbar({ initialAuth }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  const NavLinks = () =>
    isLoggedIn ? (
      <>
        <Link href="/tracks" className="nav-link">Tracks</Link>
        <Link href="/albums" className="nav-link">Albums</Link>
        <Link href="/artists" className="nav-link">Artists</Link>
        <Link href={config.auth.profilePath} className="nav-link">Profile</Link>
        <button onClick={handleLogout} className="nav-link text-red-500 hover:text-red-600">Logout</button>
      </>
    ) : (
      <>
        <Link href={config.auth.loginPath} className="nav-link">Login</Link>
        <Link href={config.auth.registerPath} className="nav-link">Register</Link>
      </>
    );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg transition-colors duration-300 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-indigo-600 dark:text-indigo-400 hover:scale-105 transform transition">
          <span className="text-3xl">🎶</span>
          <span className="hidden sm:inline">SoundWave</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-8 items-center">
          <NavLinks />
          {mounted && <ModeToggle />}
        </div>

        {/* Mobile menu button */}
        {mounted && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none text-gray-800 dark:text-gray-200"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {mounted && menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 py-6 flex flex-col gap-4 text-gray-800 dark:text-gray-200 animate-in slide-in-from-top duration-300">
          <NavLinks />
          <ModeToggle />
        </div>
      )}

      <style jsx>{`
        .nav-link {
          font-medium;
          text-gray-700 dark:text-gray-200;
          position: relative;
          transition: all 0.3s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: #6366f1; /* indigo-500 */
          transition: width 0.3s;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: #4f46e5; /* indigo-600 */
        }
      `}</style>
    </nav>
  );
}
