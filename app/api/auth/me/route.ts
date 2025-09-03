import { NextResponse } from "next/server"
import { getTokenFromCookies } from "@/lib/jwt"
import { getDb } from "@/lib/db"
import { User } from "@/models/User"

export async function GET() {
  try {
    await getDb()
    const jwt = getTokenFromCookies()
    if (!jwt) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const user = await User.findById(jwt.sub)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ email: user.email, fullName: user.fullName, provider: user.provider })
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
