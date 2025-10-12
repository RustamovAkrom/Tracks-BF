import api from "@/lib/api";

export async function forgotPassword(payload: { email: string }) {
  const { data } = await api.post("users/passwords/forgot-password/", payload);
  return data;
}
