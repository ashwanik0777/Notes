import nodemailer from "nodemailer"

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env

export async function sendOtpEmail(to: string, code: string) {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
    // Dev fallback: don't expose in API; log only
    console.log("[v0][dev-only] OTP email fallback:", { to, code })
    return
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: "Your One-Time Password",
    text: `Your OTP is ${code}. It is valid for 10 minutes.`,
    html: `<p>Your OTP is <strong>${code}</strong>.</p><p>It is valid for 10 minutes.</p>`,
  })
}
