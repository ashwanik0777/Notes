"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import GoogleButton from "@/components/auth/google-button"
import { Mail, Key } from "lucide-react"

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-gradient-to-tr from-[#374151] via-[#5191fa] to-[#fbc2eb] animate-gradient-x opacity-80">
      <svg className="absolute left-0 top-0 w-full h-full opacity-20 z-10" width="100%" height="100%">
        {/* {Array.from({ length: 25 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 100 + '%'}
            cy={Math.random() * 100 + '%'}
            r={Math.random() * 32 + 8}
            fill="#fff"
            fillOpacity={0.05 + Math.random() * 0.08}
          />
        ))} */}
      </svg>
    </div>
  )
}

export default function Page() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState<"request" | "verify">("request")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  async function requestOtp() {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "login" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to request OTP")
      setStep("verify")
      toast({ title: "OTP sent", description: "Check your email inbox for the code." })
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function submitSignin() {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Sign in failed")
      router.push("/dashboard")
    } catch (e: any) {
      toast({ title: "Sign in error", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-stretch bg-gray-50 dark:bg-gray-900">
      <AnimatedBackground />
      
      {/* Left side: Form */}
      <div className="relative z-20 w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <Card className="p-10 w-full max-w-md shadow-2xl rounded-3xl border border-white/30 bg-white/30 dark:bg-black/30 backdrop-blur-xl transition-all duration-500 space-y-6">
          <div className="flex justify-center mb-3">
            <img src="/logo.png" alt="Logo" className="w-14 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-center text-gray-600 dark:text-gray-300">Sign in to access your notes.</p>
          
          {step === "request" ? (
            <div className="space-y-5 pt-3">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-lg">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ashwani@gmail.com"
                    className="pl-10 rounded-xl border-none bg-white/60 dark:bg-white/10 transition shadow-inner focus:shadow focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <Button
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-500 hover:scale-105 transition-all rounded-xl text-lg font-semibold shadow"
                onClick={requestOtp}
                disabled={loading || !email}
              >
                {loading ? <span className="animate-spin inline-block mr-2">⏳</span> : null}
                {loading ? "Sending..." : "Get OTP"}
              </Button>
              <div className="flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></span>
                <span className="text-xs uppercase text-gray-500">or</span>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></span>
              </div>
              <GoogleButton />
              <div className="text-center mt-3">
                <span className="text-sm text-gray-800 dark:text-gray-200">New here? </span>
                <a href="/signup" className="underline font-bold hover:text-purple-700">Create account</a>
              </div>
            </div>
          ) : (
            <div className="space-y-5 pt-3">
              <div className="grid gap-2">
                <Label htmlFor="otp" className="text-lg">OTP</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 text-gray-400" size={20} />
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="pl-10 rounded-xl border-none bg-white/60 dark:bg-white/10 transition shadow-inner focus:shadow focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
              <Button
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition-all rounded-xl text-lg font-semibold shadow"
                onClick={submitSignin}
                disabled={loading || !otp}
              >
                {loading ? <span className="animate-spin inline-block mr-2">⏳</span> : null}
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Button variant="secondary" className="w-full rounded-xl mt-2" onClick={() => setStep("request")}>Back</Button>
            </div>
          )}
        </Card>
      </div>

      {/* Stylish vertical divider */}
      <div aria-hidden="true" className="hidden md:block w-1 mx-6 relative">
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[2px] h-full rounded-full bg-gradient-to-b from-purple-500 via-pink-500 to-red-500 shadow-lg opacity-80 blur-sm"></div>
        </div>
        <div className="relative w-[1px] h-full bg-white/20 rounded-full backdrop-blur-md"></div>
      </div>

      {/* Right side: Image with overlay text */}
      <div className="hidden md:flex relative w-1/2 h-screen select-none">
        <img
          src="/main.jpeg"
          alt="Inspirational background"
          className="object-cover w-full h-full brightness-90 contrast-110 rounded-r-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/70 rounded-r-3xl"></div>
        <div className="absolute bottom-16 left-12 text-white max-w-md z-20">
          <h2 className="text-4xl font-extrabold leading-tight mb-4">Welcome to Your Notes</h2>
          <p className="text-lg max-w-sm">
            Organize, secure, and access your ideas effortlessly from anywhere.
          </p>
        </div>
      </div>
    </div>
  )
}
