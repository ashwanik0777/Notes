import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { emailSchema } from "@/lib/validators"
import { OtpCode } from "@/models/OtpCode"
import { sendOtpEmail } from "@/lib/email"

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    await getDb()
    const { email } = await req.json()
    const parsed = emailSchema.safeParse(email)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const code = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min
    await OtpCode.findOneAndUpdate(
      { email: parsed.data },
      { code, expiresAt, attempts: 0 },
      { upsert: true, new: true },
    )

    await sendOtpEmail(parsed.data, code)

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed to request OTP" }, { status: 500 })
  }
}
