import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../jwt"

export type AuthedRequest = Request & { user?: { id: string; email: string; fullName?: string } }

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" })
  const token = auth.slice("Bearer ".length)
  try {
    const payload = verifyToken(token)
    req.user = { id: payload.sub, email: payload.email, fullName: payload.fullName }
    return next()
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
