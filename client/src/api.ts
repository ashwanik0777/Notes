// Simple API client with error handling
import { getToken } from "./auth"

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000"

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts.headers as any) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${SERVER_URL}${path}`, { ...opts, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || "Request failed")
  }
  return data as T
}

export const api = {
  // Auth
  sendOtpSignup: (body: { email: string; fullName: string; dob: string }) =>
    request<{ ok: boolean; devOtp?: string; message: string }>(`/auth/send-otp?mode=signup`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  sendOtpSignin: (body: { email: string }) =>
    request<{ ok: boolean; devOtp?: string; message: string }>(`/auth/send-otp`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verifyOtpSignup: (body: { email: string; otp: string; fullName: string; dob: string }) =>
    request<{ token: string; user: any }>(`/auth/verify-otp?mode=signup`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verifyOtpSignin: (body: { email: string; otp: string }) =>
    request<{ token: string; user: any }>(`/auth/verify-otp`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Notes
  listNotes: () => request<{ notes: { id: string; content: string; createdAt: string }[] }>(`/notes`),
  createNote: (content: string) =>
    request<{ note: { id: string; content: string; createdAt: string } }>(`/notes`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  deleteNote: (id: string) => request<{ ok: boolean }>(`/notes/${id}`, { method: "DELETE" }),

  serverUrl: SERVER_URL,
}
