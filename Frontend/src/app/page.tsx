import { Music, Play, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 
      bg-gradient-to-b from-white via-gray-100 to-gray-200 
      dark:from-black dark:via-gray-900 dark:to-gray-800 
      text-gray-900 dark:text-white transition-colors duration-300"
    >
      {/* Hero Section */}
      <section className="text-center max-w-3xl pt-20">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Discover. Listen. Enjoy.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Your personal space for music. Stream tracks, create playlists, and
          connect with artists worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <button
              className="px-6 py-3 w-full sm:w-auto bg-indigo-600 text-white rounded-2xl shadow-lg 
                hover:bg-indigo-500 dark:hover:bg-indigo-400 transition font-medium"
            >
              Login
            </button>
          </Link>
          <Link href="/register">
            <button
              className="px-6 py-3 w-full sm:w-auto bg-gray-200 text-gray-900 rounded-2xl shadow-lg 
                hover:bg-gray-300 transition
                dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 font-medium"
            >
              Register
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full text-center">
        <div className="p-6 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-md 
          hover:scale-105 hover:shadow-xl transition backdrop-blur">
          <Music className="mx-auto w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Endless Music</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Explore thousands of tracks across all genres and moods.
          </p>
        </div>

        <div className="p-6 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-md 
          hover:scale-105 hover:shadow-xl transition backdrop-blur">
          <Play className="mx-auto w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Playlists</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Build your own playlists and discover new favorites daily.
          </p>
        </div>

        <div className="p-6 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-md 
          hover:scale-105 hover:shadow-xl transition backdrop-blur">
          <Users className="mx-auto w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Join the Community</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with music lovers and share your vibe worldwide.
          </p>
        </div>
      </section>

      {/* Highlight CTA */}
      <section className="mt-20 bg-indigo-600 text-white dark:bg-indigo-500 rounded-2xl p-8 max-w-4xl text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Start your music journey today!</h2>
        <p className="mb-6 text-lg">
          Sign up for free and unlock unlimited access to tracks, playlists, and
          community.
        </p>
        <Link href="/register">
          <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition">
            Create Account
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-20 mb-6 text-gray-500 dark:text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} Trackify. All rights reserved.
      </footer>
    </div>
  );
}
