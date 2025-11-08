import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import type { TokenResponseType } from "@/types/authTypes";
import config from "@/config/config.site";

const api = axios.create({
  baseURL: config.api.baseUrl,
  withCredentials: true,
});

// Добавляем access token в заголовки
api.interceptors.request.use((config) => {
  const token = Cookies.get("access");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехват 401 и обновление access токена
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = Cookies.get("refresh");
        if (!refresh) throw new Error("No refresh token");

        const { data } = await axios.post<TokenResponseType>(
          `${config.api.baseUrl}/users/auth/jwt/refresh/`,
          { refresh }
        );

        Cookies.set("access", data.access, { secure: true });
        api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

        return api(originalRequest);
      } catch (err) {
        Cookies.remove("access");
        Cookies.remove("refresh");
        // if (typeof window !== "undefined") {
        //   window.location.href = config.auth.loginPath;
        // }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
