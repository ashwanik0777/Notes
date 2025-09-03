"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleButton } from "@/components/auth/google-button"
import { signinSchema } from "@/lib/validators"

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", otp: "" })
  const [errors, setErrors] = useState<Partial<Record<"email" | "otp", string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [otpRequested, setOtpRequested] = useState(false)
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [loading, setLoading] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const requestOtp = async () => {
    setApiError(null)
    setLoadingOtp(true)
    try {
      const email = z.string().email().parse(form.email)
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to request OTP")
      setOtpRequested(true)
    } catch (e) {
      setApiError((e as Error).message)
    } finally {
      setLoadingOtp(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    setErrors({})
    setLoading(true)
    try {
      signinSchema.parse(form)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Sign in failed")
      window.location.href = "/dashboard"
    } catch (e: any) {
      if (e.name === "ZodError") {
        const fieldErrors: any = {}
        e.issues.forEach((i: any) => {
          fieldErrors[i.path[0]] = i.message
        })
        setErrors(fieldErrors)
      } else {
        setApiError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="grid gap-8 md:grid-cols-2 w-full max-w-5xl">
        <Card className="order-2 md:order-1">
          <CardHeader>
            <CardTitle className="text-balance">Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={requestOtp} disabled={loadingOtp}>
                  {loadingOtp ? "Sending..." : "Get OTP"}
                </Button>
                {otpRequested && <span className="text-sm text-muted-foreground">OTP sent to your email</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={6}
                  value={form.otp}
                  onChange={onChange}
                  placeholder="6-digit code"
                />
                {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
              </div>

              {apiError && <p className="text-sm text-destructive">{apiError}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="my-2 text-center text-sm text-muted-foreground">or</div>
              <GoogleButton />

              <p className="text-sm text-center mt-4">
                New here?{" "}
                <Link href="/signup" className="text-primary underline underline-offset-4">
                  Create account
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="order-1 md:order-2 hidden md:block">
          <Image
            src="https://img.freepik.com/premium-photo/creative-pencil-clipboard-mockups-professional-design-projects_984027-142724.jpg?ga=GA1.1.703435206.1736420789&semt=ais_incoming&w=740&q=80"
            alt="Design reference"
            width={1200}
            height={900}
            className="w-full h-full object-cover rounded-xl border"
          />
        </div>
      </div>
    </main>
  )
}
