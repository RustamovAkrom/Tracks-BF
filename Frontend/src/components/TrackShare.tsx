import { useState, useRef, useEffect } from "react";
import { Share2, Facebook, Twitter, Mail } from "lucide-react";
import { TrackType } from "@/types/tracksTypes";

interface TrackShareProps {
  track: TrackType;
}

export const TrackShare: React.FC<TrackShareProps> = ({ track }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие popup при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(track.name);

  const socialLinks = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, icon: <Facebook className="w-5 h-5" /> },
    { name: "Twitter", href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`, icon: <Twitter className="w-5 h-5" /> },
    { name: "Telegram", href: `https://t.me/share/url?url=${url}&text=${text}`, icon: <Share2 className="w-5 h-5" /> }, // используем Share2 для Telegram
    { name: "Email", href: `mailto:?subject=${text}&body=${url}`, icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer transition-all hover:scale-110 select-none bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <Share2 className="w-5 h-5" />
        <span className="text-sm font-medium">Share</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-44 z-50 flex flex-col gap-1">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 transition"
            >
              {social.icon}
              <span className="text-sm">{social.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
