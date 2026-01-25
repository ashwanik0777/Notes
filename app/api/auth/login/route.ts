import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import { signinSchema } from "@/lib/validators"
import { OtpCode } from "@/models/OtpCode"
import { User } from "@/models/User"
import { signToken } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
  await dbConnect()
    const body = await req.json()
    const parsed = signinSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { email, otp } = parsed.data
    const otpDoc = await OtpCode.findOne({ email })
    if (!otpDoc) return NextResponse.json({ error: "OTP not found. Please request a new one." }, { status: 400 })
    if (otpDoc.expiresAt < new Date()) return NextResponse.json({ error: "OTP expired." }, { status: 400 })
    if (otpDoc.code !== otp) return NextResponse.json({ error: "Invalid OTP." }, { status: 400 })

    let user = await User.findOne({ email })
    if (!user) {
      // Allow first login to create user with minimal fields
      user = await User.create({ email, provider: "otp" })
    }
    await OtpCode.deleteOne({ email })

    const token = signToken({ sub: user._id.toString(), email: user.email, name: user.fullName, provider: "otp" })
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
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 })
  }
}
