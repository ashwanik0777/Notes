import { getAuthTokenFromCookies, verifyJwt } from "./jwt"
import { dbConnect } from "./db"
import User from "@/models/User"

export async function getCurrentUser() {
  const token = getAuthTokenFromCookies()
  if (!token) return null
  const payload = verifyJwt(token)
  if (!payload) return null
  await dbConnect()
  const user = await User.findById(payload.sub).lean()
  if (!user) return null
  return {
    id: String(user._id),
    email: user.email as string,
    name: user.name as string,
    provider: user.provider as "email" | "google",
  }
}
