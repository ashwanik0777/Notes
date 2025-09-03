import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { getDb } from "@/lib/db"
import { User } from "@/models/User"
import { signToken } from "@/lib/jwt"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export async function POST(req: Request) {
  try {
    await getDb()
    const { credential } = await req.json()
    if (!credential) return NextResponse.json({ error: "Missing Google credential" }, { status: 400 })
    if (!GOOGLE_CLIENT_ID) return NextResponse.json({ error: "Google client id not configured" }, { status: 500 })

    const client = new OAuth2Client(GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) return NextResponse.json({ error: "Invalid Google token" }, { status: 400 })

    const email = payload.email
    const name = payload.name

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({ email, fullName: name, provider: "google" })
    } else if (user.provider !== "google") {
      // User exists via OTP; allow linking implicitly by setting provider if not set
      if (!user.provider) user.provider = "google"
      await user.save()
    }

    const token = signToken({ sub: user._id.toString(), email: user.email, name: user.fullName, provider: "google" })
    const res = NextResponse.json({ ok: true, user: { email: user.email, fullName: user.fullName } })
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })
    return res
  } catch (e) {
    return NextResponse.json({ error: "Google sign-in failed" }, { status: 500 })
  }
}
