// lib/profile.ts
import api from "@/lib/api";
import type { ProfileType } from "@/types/profilesTypes";


// Получение профиля
export async function getProfile(): Promise<ProfileType> {
  const { data } = await api.get<ProfileType>("/users/profile/");
  return data;
}

// Обновление профиля
export async function updateProfile(payload: Partial<ProfileType>): Promise<ProfileType> {
  const { data } = await api.patch<ProfileType>("/users/profile/", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// Отправка письма с подтверждением email
export async function sendVerifyEmail(): Promise<{ detail: string }> {
  const { data } = await api.post("/users/send-verify-email/");
  return data;
}