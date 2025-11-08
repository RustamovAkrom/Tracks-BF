// lib/me.ts
import api from "@/lib/api";
import type { MeType } from "@/types/meTypes";

export async function getMe(): Promise<MeType> {
  const { data } = await api.get<MeType>("/users/me/");
  return data;
}
