"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"

type Props = {
  label?: string
  onSuccessRedirect?: string
}

export function GoogleButton({ label = "Continue with Google", onSuccessRedirect = "/dashboard" }: Props) {
  const divRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
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
          const data = await r.json().catch(() => ({}))
          if (!r.ok) {
            alert(data.error || "Google sign-in failed")
            return
          }
          window.location.href = onSuccessRedirect
        } catch {
          alert("Google sign-in failed")
        }
      },
    })
    w.google.accounts.id.renderButton(divRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      text: "continue_with",
      shape: "rectangular",
    })
    setReady(true)
  }, [clientId])

  // Fallback button if script hasn’t loaded or client id missing
  if (!clientId) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full bg-transparent"
        disabled
        title="Google Client ID not configured"
      >
        {label}
      </Button>
    )
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setReady(true)} />
      <div aria-live="polite">
        {!ready && (
          <Button type="button" variant="outline" className="w-full bg-transparent" disabled>
            {label}
          </Button>
        )}
        <div ref={divRef} />
      </div>
    </>
  )
}

export default GoogleButton
