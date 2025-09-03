"use client"

import React, { useState } from "react"
import { z } from "zod"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleButton } from "@/components/auth/google-button"
import { signupSchema } from "@/lib/validators"

const schema = signupSchema

export default function SignUpPage() {
  const [form, setForm] = useState({ fullName: "", dob: "", email: "", otp: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
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
      schema.parse(form)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")
      window.location.href = "/dashboard"
    } catch (e) {
      const err = e as any
      if (err.name === "ZodError") {
        const fieldErrors: any = {}
        err.issues.forEach((i: any) => {
          fieldErrors[i.path[0]] = i.message
        })
        setErrors(fieldErrors)
      } else {
        setApiError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col md:flex-row items-stretch bg-gray-50 dark:bg-gray-900">
      
      {/* Left side: Form */}
      <div className="relative z-20 w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <Card className="p-10 w-full max-w-md shadow-2xl rounded-3xl border border-white/30 bg-white/30 dark:bg-black/30 backdrop-blur-xl transition-all duration-500 space-y-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
              Sign up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit} noValidate>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  placeholder="Ashwani"
                  className="rounded-xl border-none bg-white/60 dark:bg-white/10 shadow-inner focus:shadow focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="text"
                  value={form.dob}
                  onChange={onChange}
                  placeholder="1 December 1997"
                  className="rounded-xl border-none bg-white/60 dark:bg-white/10 shadow-inner focus:shadow focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.dob && <p className="text-sm text-destructive">{errors.dob}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="ashwani@gmail.com"
                  className="rounded-xl border-none bg-white/60 dark:bg-white/10 shadow-inner focus:shadow focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={requestOtp}
                  disabled={loadingOtp || !form.email}
                  className="rounded-xl"
                >
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
                  className="rounded-xl border-none bg-white/60 dark:bg-white/10 shadow-inner focus:shadow focus:ring-2 focus:ring-purple-400 transition"
                />
                {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
              </div>

              {apiError && <p className="text-sm text-destructive">{apiError}</p>}

              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition-all rounded-xl text-lg font-semibold shadow"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </Button>

              <div className="my-2 text-center text-sm text-muted-foreground">or</div>

              <GoogleButton />

              <p className="text-sm text-center mt-4 dark:text-gray-300">
                Already have an account?{" "}
                <Link href="/" className="text-purple-700 underline underline-offset-4 hover:text-purple-900">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right side: image with overlay text */}
      <div className="hidden md:flex relative w-1/2 h-screen select-none">
        <Image
          src="https://img.freepik.com/premium-photo/creative-pencil-clipboard-mockups-professional-design-projects_984027-142724.jpg?ga=GA1.1.703435206.1736420789&semt=ais_incoming&w=740&q=80"
          alt="Design reference"
          fill
          className="object-cover rounded-r-3xl border border-white/20"
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/70 rounded-r-3xl"></div>
      </div>

      <style jsx>{`
        div[aria-hidden="true"] svg {
          height: 100%;
          width: 100%;
          display: block;
        }
      `}</style>
    </main>
  )
}
