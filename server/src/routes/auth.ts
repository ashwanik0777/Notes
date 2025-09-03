import { Router } from "express"
import { z } from "zod"
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { APP_URL, DEV_MODE, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL } from "../config"
import type { InMemoryOTPStore } from "../repositories/InMemory"
import type { User } from "../types"
import { signUser } from "../jwt"

type Deps = {
  users: {
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
    create(user: Omit<User, "id" | "createdAt">): Promise<User>
  }
  otp: InMemoryOTPStore
}

const emailSchema = z.string().email("Please enter a valid email")
const signupSchema = z.object({
  email: emailSchema,
  fullName: z.string().min(2, "Full name is required"),
  dob: z.string().min(4, "Date of birth is required"),
})
const otpSchema = z.object({ email: emailSchema, otp: z.string().length(6, "OTP must be 6 digits") })

export function authRouter(deps: Deps) {
  const router = Router()

  // OTP: send (for signup or login)
  router.post("/send-otp", async (req, res) => {
    const isSignup = req.query.mode === "signup"
    const body = req.body || {}
    try {
      if (isSignup) {
        const parsed = signupSchema.parse(body)
        // Optionally persist partial info for signup; here we simply validate.
        // Generate OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        deps.otp.set(parsed.email, code)
        // In dev mode, return OTP for convenience
        return res.json({ ok: true, devOtp: DEV_MODE ? code : undefined, message: "OTP sent" })
      } else {
        const email = emailSchema.parse(body.email)
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        deps.otp.set(email, code)
        return res.json({ ok: true, devOtp: DEV_MODE ? code : undefined, message: "OTP sent" })
      }
    } catch (e: any) {
      return res.status(400).json({ error: e?.errors?.[0]?.message || "Invalid input" })
    }
  })

  // OTP: verify (signup or login)
  router.post("/verify-otp", async (req, res) => {
    const isSignup = req.query.mode === "signup"
    try {
      const { email, otp } = otpSchema.parse(req.body || {})
      const ok = deps.otp.verify(email, otp)
      if (!ok) return res.status(400).json({ error: "Invalid or expired OTP" })

      let user = await deps.users.findByEmail(email)
      if (!user) {
        if (!isSignup) return res.status(404).json({ error: "Account not found. Please sign up." })
        // For signup path, also require the fullName & dob in the verify request to finalize creation
        const fullName = String((req.body || {}).fullName || "")
        const dob = String((req.body || {}).dob || "")
        if (fullName.length < 2 || dob.length < 4) return res.status(400).json({ error: "Full name and DOB required" })

        user = await deps.users.create({ email, fullName, dob, provider: "local" })
      }
      const token = signUser(user)
      return res.json({ token, user })
    } catch (e: any) {
      return res.status(400).json({ error: e?.errors?.[0]?.message || "Invalid input" })
    }
  })

  // Google OAuth (optional)
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: `${SERVER_URL}/auth/google/callback`,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = (profile.emails?.[0]?.value || "").toLowerCase()
            if (!email) return done(new Error("No email from Google"))
            let user = await deps.users.findByEmail(email)
            if (!user) {
              user = await deps.users.create({
                email,
                fullName: profile.displayName || undefined,
                dob: undefined,
                provider: "google",
              })
            }
            return done(null, user)
          } catch (err) {
            return done(err as any)
          }
        },
      ),
    )

    router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
    router.get(
      "/google/callback",
      passport.authenticate("google", { session: false, failureRedirect: `${APP_URL}/signin?error=oauth_failed` }),
      (req, res) => {
        const user = req.user as User
        const token = signUser(user)
        // Redirect back to app with token in URL fragment (avoids logs)
        return res.redirect(`${APP_URL}/oauth/callback#token=${encodeURIComponent(token)}`)
      },
    )
  }

  // Me: verify token
  router.get("/me", async (req, res) => {
    // This endpoint expects Authorization header; front-end will call /notes endpoints that already enforce auth.
    return res.json({ ok: true })
  })

  return router
}
