"use client";

import Link from "next/link";
import { useState } from "react";
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

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  const NavLinks = () =>
    isLoggedIn ? (
      <>
        <Link
          href="/albums"
          className="hover:text-primary transition-colors"
        >
          Albums
        </Link>
        <Link
          href="/artists"
          className="hover:text-primary transition-colors"
        >
          Artists
        </Link>
        <Link
          href={config.auth.profilePath}
          className="hover:text-primary transition-colors"
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="hover:text-red-500 transition-colors"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link
          href={config.auth.loginPath}
          className="hover:text-primary transition-colors"
        >
          Login
        </Link>
        <Link
          href={config.auth.registerPath}
          className="hover:text-primary transition-colors"
        >
          Register
        </Link>
      </>
    );

  return (
    <nav className="fixed top-0 left-0 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Лого */}
        <Link
          href="/"
          className="font-bold text-lg tracking-wide flex items-center gap-2 text-gray-900 dark:text-gray-100"
        >
          🎵 <span className="hidden sm:inline">MyMusic</span>
        </Link>

        {/* Десктоп меню */}
        <div className="hidden md:flex gap-6 items-center text-gray-800 dark:text-gray-200">
          <NavLinks />
          <ModeToggle />
        </div>

        {/* Мобильное меню кнопка */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none text-gray-800 dark:text-gray-200"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 px-4 py-6 flex flex-col gap-4 text-gray-800 dark:text-gray-200 animate-in slide-in-from-top duration-200">
          <NavLinks />
          <ModeToggle />
        </div>
      )}
    </nav>
  );
}
