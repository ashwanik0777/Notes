// components/google-sign-in.tsx
"use client"

import Script from "next/script"
import { useEffect, useRef } from "react"

export default function GoogleSignIn({ onSuccess }: { onSuccess: () => void }) {
  const divRef = useRef<HTMLDivElement>(null)
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  useEffect(() => {
    const w = window as any
    if (!clientId || !w.google || !divRef.current) return
    w.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: any) => {
        try {
          const r = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential }),
          })
          if (!r.ok) {
            const data = await r.json().catch(() => ({}))
            alert(data.error || "Google sign-in failed")
            return
          }
          onSuccess()
        } catch {
          alert("Google sign-in failed")
        }
      },
    })
    w.google.accounts.id.renderButton(divRef.current, { theme: "outline", size: "large" })
  }, [clientId])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div ref={divRef} className="mt-2" />
    </>
  )
}
