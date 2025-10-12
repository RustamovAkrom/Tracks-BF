// app/providers/AuthProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem("access_token");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");

    if (access) {
      setUser({ email, name });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
