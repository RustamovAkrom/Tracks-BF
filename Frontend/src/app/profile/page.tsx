"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getProfile, updateProfile, sendVerifyEmail } from "@/lib/profile";
import { getMe } from "@/lib/me";
import type { MeType } from "@/types/meTypes";
import { forgotPassword } from "@/lib/passwords";
import { Loader2, Save, Lock, Mail } from "lucide-react";
import type { ProfileType } from "@/types/profilesTypes";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [me, setMe] = useState<MeType | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [verifyCooldown, setVerifyCooldown] = useState(0);
  const cooldownRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    Promise.all([getProfile(), getMe()])
      .then(([profileData, meData]) => {
        setProfile(profileData);
        setMe(meData);
        setFirstName(profileData.first_name || "");
        setLastName(profileData.last_name || "");
      })
      .catch(() => setError("Ошибка загрузки профиля"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      if (firstName !== profile.first_name) formData.append("first_name", firstName);
      if (lastName !== profile.last_name) formData.append("last_name", lastName);
      if (avatarFile) formData.append("avatar", avatarFile);

      const updated = await updateProfile(formData as any);
      setProfile(updated);

      const meUpdated = await getMe();
      setMe(meUpdated);

      setMessage("Профиль успешно обновлён");
      setAvatarFile(null);
    } catch {
      setError("Ошибка при сохранении профиля");
    } finally {
      setSaving(false);
    }
  }

  async function handleForgotPassword() {
    if (!me?.email) return setError("Email не найден");
    setError(null);
    setMessage(null);
    setSaving(true);

    try {
      await forgotPassword({ email: me.email });
      setMessage("Ссылка для сброса пароля отправлена на вашу почту");
    } catch {
      setError("Не удалось отправить письмо. Попробуйте позже.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSendVerifyEmail() {
    if (!me || verifyCooldown > 0) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await sendVerifyEmail();
      setMessage("Ссылка для подтверждения отправлена на вашу почту");

      setVerifyCooldown(60);
      cooldownRef.current = setInterval(() => {
        setVerifyCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError("Не удалось отправить письмо. Попробуйте позже.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
        <p className="text-gray-700 dark:text-gray-300">Нет данных профиля</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center px-6 py-10 bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="w-full max-w-2xl backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-2xl p-6 flex flex-col gap-8">

        <h1 className="text-2xl font-bold text-center">PROFILE INFO</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500">
            <Image
              src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatar || me.avatar || "/default-avatar.png"}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>
          <label className="mt-3 cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Edit Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
            />
          </label>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-500">Login</p>
            <p className="font-medium">{me.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium flex items-center gap-2">
              {me.email}
              {!me.is_email_verified && <span className="text-xs text-red-500">(не подтверждён)</span>}
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Surname</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>

        {message && <p className="text-center text-green-600 font-medium">{message}</p>}
        {error && <p className="text-center text-red-600 font-medium">{error}</p>}

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleForgotPassword}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg shadow-md transition disabled:opacity-50"
          >
            <Lock className="w-5 h-5" />
            Send Password Reset Link
          </button>

          {!me.is_email_verified && (
            <button
              onClick={handleSendVerifyEmail}
              disabled={saving || verifyCooldown > 0}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg shadow-md transition text-white ${
                verifyCooldown > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
              }`}
            >
              <Mail className="w-5 h-5" />
              {verifyCooldown > 0 ? `Verify email (${verifyCooldown}s)` : "Send Email Verification Link"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
