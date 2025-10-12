import api from "./api";
import Cookies from "js-cookie";
import type { TokenResponseType, LoginPayloadType, RegisterPayloadType } from "@/types/authTypes";
import config from "@/config/config.site";


export async function login(payload: LoginPayloadType): Promise<void> {
  const { data } = await api.post<TokenResponseType>("users/auth/jwt/create/", payload);

  Cookies.set("access", data.access, { secure: true });
  Cookies.set("refresh", data.refresh, { secure: true });
}

export async function register(payload: RegisterPayloadType): Promise<any> {
  const { data } = await api.post("users/auth/signup/", payload);
  return data;
}

export async function logout(): Promise<void> {
  try {
    const refresh = Cookies.get("refresh");
    if (refresh) {
      await api.post("users/auth/jwt/logout/", { refresh });
    }
  } catch (err) {
    console.error("Ошибка logout:", err);
  } finally {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("email");
    Cookies.remove("name");
    if (typeof window !== "undefined") {
      window.location.href = config.auth.loginPath; // редирект на страницу входа
    }
  }
}

export async function getUser() {
  try {
    const token = Cookies.get("access"); // достаем токен из cookie

    if (!token) {
      throw new Error("Нет access токена");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ добавляем заголовок
      },
    });

    if (!res.ok) {
      throw new Error(`Ошибка загрузки профиля: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("getUser error:", err);
    return null;
  }
}