"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getProfile, updateProfile, sendVerifyEmail } from "@/lib/profile";
import { getMe, Me } from "@/lib/me";
import { forgotPassword } from "@/lib/passwords";
import { Loader2, Save, Lock, Mail } from "lucide-react";
import type { ProfileType } from "@/types/profilesTypes";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [me, setMe] = useState<Me | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [verifyCooldown, setVerifyCooldown] = useState(0);
  const cooldownRef = useRef<NodeJS.Timer | null>(null);

  // Загрузка профиля и пользователя
  useEffect(() => {
    Promise.all([getProfile(), getMe()])
      .then(([profileData, meData]) => {
        setProfile(profileData);
        setMe(meData);
        setFirstName(profileData.first_name || "");
        setLastName(profileData.last_name || "");
      })
      .catch((err) => {
        console.error(err);
        setError("Ошибка загрузки профиля");
      })
      .finally(() => setLoading(false));
  }, []);

  // Сохранение профиля
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
    } catch (err) {
      console.error(err);
      setError("Ошибка при сохранении профиля");
    } finally {
      setSaving(false);
    }
  }

  // Сброс пароля
  async function handleForgotPassword() {
    if (!me?.email) return setError("Email не найден");
    setError(null);
    setMessage(null);
    setSaving(true);

    try {
      await forgotPassword({ email: me.email });
      setMessage("Ссылка для сброса пароля отправлена на вашу почту");
    } catch (err) {
      console.error(err);
      setError("Не удалось отправить письмо. Попробуйте позже.");
    } finally {
      setSaving(false);
    }
  }

  // Подтверждение email с cooldown
  async function handleSendVerifyEmail() {
    if (!me || verifyCooldown > 0) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await sendVerifyEmail();
      setMessage("Ссылка для подтверждения отправлена на вашу почту");

      // Устанавливаем cooldown 60 секунд
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
    } catch (err) {
      console.error(err);
      setError("Не удалось отправить письмо. Попробуйте позже.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile || !me) {
    return <p className="text-center mt-10">Нет данных профиля</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">👤 Профиль</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500">
            <Image
              src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatar || me.avatar || "/default-avatar.png"}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>
          <label className="mt-3 cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Изменить аватар
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
            />
          </label>
        </div>

        {/* Readonly fields */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Логин</p>
          <p className="font-medium">{me.username}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium flex items-center gap-2">
            {me.email}
            {!me.is_email_verified && <span className="text-xs text-red-500">(не подтверждён)</span>}
          </p>
        </div>

        {/* Editable fields */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">Имя</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm text-gray-500 mb-1">Фамилия</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800"
          />
        </div>

        {message && <p className="text-center text-green-600 text-sm font-medium mb-4">{message}</p>}
        {error && <p className="text-center text-red-600 text-sm font-medium mb-4">{error}</p>}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Сохранение..." : "Сохранить"}
        </button>

        {/* Extra actions */}
        <div className="mt-8 space-y-4">
          {/* Forgot password */}
          <button
            onClick={handleForgotPassword}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg shadow-md transition disabled:opacity-50"
          >
            <Lock className="w-5 h-5" />
            Отправить ссылку для сброса пароля
          </button>

          {/* Verify email */}
          {!me.is_email_verified && (
            <button
              onClick={handleSendVerifyEmail}
              disabled={saving || verifyCooldown > 0}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg shadow-md transition text-white ${
                verifyCooldown > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
              }`}
            >
              <Mail className="w-5 h-5" />
              {verifyCooldown > 0 ? `Подтвердить email (${verifyCooldown}s)` : "Подтвердить email"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
