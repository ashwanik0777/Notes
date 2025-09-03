"use client"

import type React from "react"
import { useState } from "react"
import FormInput from "../components/FormInput"
import { api } from "../api"
import { setAuth } from "../auth"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dob: z.string().min(4, "Date of birth is required"),
  email: z.string().email("Please enter a valid email"),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
})

export default function Signup() {
  const [form, setForm] = useState({ fullName: "", dob: "", email: "", otp: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "otp-sent" | "verifying">("idle")
  const [apiError, setApiError] = useState<string | null>(null)
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const navigate = useNavigate()

  function update<K extends keyof typeof form>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function onGetOtp() {
    setApiError(null)
    const res = schema.safeParse({ ...form, otp: undefined })
    if (!res.success) {
      const errs: Record<string, string> = {}
      res.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message))
      setErrors(errs)
      return
    }
    try {
      const r = await api.sendOtpSignup({ email: form.email, fullName: form.fullName, dob: form.dob })
      setStatus("otp-sent")
      setDevOtp(r.devOtp || null)
    } catch (e: any) {
      setApiError(e.message)
    }
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)
    setErrors({})
    const res = schema.safeParse(form)
    if (!res.success) {
      const errs: Record<string, string> = {}
      res.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message))
      setErrors(errs)
      return
    }
    try {
      setStatus("verifying")
      const r = await api.verifyOtpSignup({
        email: form.email,
        otp: form.otp,
        fullName: form.fullName,
        dob: form.dob,
      })
      setAuth(r.token, r.user)
      navigate("/dashboard", { replace: true })
    } catch (e: any) {
      setStatus("otp-sent")
      setApiError(e.message)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <header className="auth-header">
          <div className="brand-dot" aria-hidden="true"></div>
          <span className="brand-text">HD</span>
        </header>

        <div className="auth-body">
          <div className="form-col">
            <h1 className="title">Sign up</h1>
            <p className="subtitle">Set up an account for the future of life</p>

            <form onSubmit={onSignup} className="form">
              <FormInput
                label="Full name"
                placeholder="Jane Doe"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                error={errors.fullName}
              />
              <FormInput
                label="Date of birth"
                placeholder="DD/MM/YYYY"
                value={form.dob}
                onChange={(e) => update("dob", e.target.value)}
                error={errors.dob}
              />
              <FormInput
                label="Email"
                placeholder="jane.doe@example.com"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
              />

              {status !== "otp-sent" ? (
                <button type="button" className="btn" onClick={onGetOtp}>
                  Get OTP
                </button>
              ) : (
                <>
                  <FormInput
                    label="OTP"
                    placeholder="Enter 6-digit code"
                    value={form.otp}
                    onChange={(e) => update("otp", e.target.value)}
                    error={errors.otp}
                    inputMode="numeric"
                    maxLength={6}
                  />
                  <button disabled={status === "verifying"} type="submit" className="btn">
                    {status === "verifying" ? "Verifying..." : "Sign up"}
                  </button>
                </>
              )}

              {devOtp ? <p className="hint">Dev OTP: {devOtp}</p> : null}
              {apiError ? <p className="error-center">{apiError}</p> : null}

              <p className="small">
                Already have an account?{" "}
                <Link to="/signin" className="link">
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          <div className="image-col">
            <img src="/images/hero.png" alt="Decorative abstract blue background" />
          </div>
        </div>
      </div>
    </div>
  )
}
