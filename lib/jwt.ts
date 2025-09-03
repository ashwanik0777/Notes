import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"

export type JwtPayload = {
  sub: string
  email: string
  name?: string
  provider?: "otp" | "google"
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function getTokenFromCookies(): JwtPayload | null {
  const store = cookies()
  const token = store.get("token")?.value
  if (!token) return null
  return verifyToken(token)
}
