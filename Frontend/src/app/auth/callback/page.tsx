"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      const access = params.get("access");
      const refresh = params.get("refresh");
      const email = params.get("email");
      const name = params.get("name");

      console.log("🔑 Access Token:", access);
      console.log("🔑 Refresh Token:", refresh);
      console.log("📧 Email:", email);
      console.log("👤 Name:", name);

      if (access && refresh) {
        // ✅ сохраняем в cookies, а не в localStorage
        Cookies.set("access", access);
        Cookies.set("refresh", refresh);
        Cookies.set("email", email || "");
        Cookies.set("name", name || "");

        console.log("✅ Tokens saved to Cookies");

        // редиректим на главную
        router.push("/");
      } else {
        console.error("❌ Tokens not found in URL");
      }
    }
  }, [router]);

  return <p>Авторизация проходит...</p>;
}
