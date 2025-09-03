import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config"
import type { User } from "./types"

export type JWTPayload = { sub: string; email: string; fullName?: string }

export function signUser(user: User): string {
  const payload: JWTPayload = { sub: user.id, email: user.email, fullName: user.fullName }
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "2h" })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}
