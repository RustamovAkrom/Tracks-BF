"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    async function verifyEmail() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/passwords/verify-email/?token=${token}`,
          { method: "GET", headers: { Accept: "*/*" } }
        );

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.detail || "Email verified successfully");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.detail || "Verification failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Server error");
      }
    }

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4 text-center">
      {status === "loading" && <p>🔄 Verifying email...</p>}
      {status === "success" && (
        <>
          <h1 className="text-2xl text-green-600">✅ Email confirmed!</h1>
          <p>Redirecting to login page...</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl text-red-600">❌ Verification failed</h1>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}
