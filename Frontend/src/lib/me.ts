// lib/me.ts
import api from "@/lib/api";

export interface Me {
  id: number;
  username: string;
  email: string;
  is_email_verified: boolean;
  avatar?: string | null;
}

export async function getMe(): Promise<Me> {
  const { data } = await api.get<Me>("/users/me/");
  return data;
}
