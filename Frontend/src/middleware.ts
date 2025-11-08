// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import config from "./config/config.site";

// 🔑 Страницы, которые требуют авторизации
const protectedRoutes: string[] = [
  "/tracks",
  "/albums",
  "/artists",
  "/playlists",
  "/likes",
  "/history",
  "/profile",
  "/settings",
];

// 🔑 Страницы, которые доступны только НЕавторизованным
const guestOnlyRoutes: string[] = [
  "/login",
  "/register",
];

export function middleware(req: NextRequest) {
  const access = req.cookies.get("access");
  const { pathname } = req.nextUrl;

  // 1) Если нет токена и зашёл в защищённые страницы → редиректим на login
  if (!access && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(config.auth.loginPath, req.url));
  }

  // 2) Если токен есть и юзер пошёл на login/register → редиректим на главную
  if (access && guestOnlyRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
