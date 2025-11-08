"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { logout } from "@/lib/auth";
import { getMe } from "@/lib/me";
import type { MeType } from "@/types/meTypes";
import { Menu, X } from "lucide-react";
import config from "@/config/config.site";
import { ModeToggle } from "./ThemeToggle";

interface NavbarProps {
  initialAuth: boolean;
}

export default function Navbar({ initialAuth }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [me, setMe] = useState<MeType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = me?.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL}${me.avatar}`
    : "/default-avatar.png";

  // Получение данных пользователя
  useEffect(() => {
    setMounted(true);
    if (initialAuth) {
      getMe()
        .then((data) => setMe(data))
        .catch(() => setIsLoggedIn(false));
    }
  }, [initialAuth]);

  // Закрытие dropdown при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link href="/tracks" className="nav-link">Tracks</Link>
      <Link href="/albums" className="nav-link">Albums</Link>
      <Link href="/artists" className="nav-link">Artists</Link>
    </>
  );

  const AuthDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center rounded-full border-2 border-indigo-500 overflow-hidden w-10 h-10 focus:outline-none"
      >
        <Image
          src={avatarUrl}
          alt={me?.username || "User Avatar"}
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 py-2 animate-dropdown">
          <Link
            href={config.auth.profilePath}
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Profile
          </Link>
          <Link
            href="/history"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            History
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-indigo-600 dark:text-indigo-400 hover:scale-105 transform transition"
        >
          SoundWave
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {isLoggedIn && me && <NavLinks />}
          {mounted && <ModeToggle />}
          {isLoggedIn && me ? (
            <AuthDropdown />
          ) : (
            <>
              <div>
              <Link href={config.auth.loginPath} className="nav-link">Login</Link>
                
              </div>
              <div>
              <Link href={config.auth.registerPath} className="nav-link">Register</Link>

              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        {mounted && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {mounted && menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 py-6 flex flex-col gap-4 text-gray-800 dark:text-gray-200 animate-dropdown">
          {isLoggedIn && me && <NavLinks />}
          {isLoggedIn && me ? (
            <>
              <Link href={config.auth.profilePath} className="nav-link">Profile</Link>
              <Link href="/history" className="nav-link">History</Link>
              <button onClick={handleLogout} className="nav-link text-red-500 hover:text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link href={config.auth.loginPath} className="nav-link">Login</Link>
              <Link href={config.auth.registerPath} className="nav-link">Register</Link>
            </>
          )}
          <ModeToggle />
        </div>
      )}

      <style jsx>{`
        .nav-link {
          font-medium;
          color: #374151;
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
          background: #6366f1;
          transition: width 0.3s;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: #4f46e5;
        }
        .animate-dropdown {
          animation: dropdownFade 0.2s ease-out forwards;
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
