"use client"

// Stores token from URL fragment after Google OAuth and redirects to dashboard
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { setAuth } from "../auth"

export default function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get("token")
    if (token) {
      // We don't have user object on this path; minimal decode not implemented client-side
      // The server redirects here; user data can be fetched later if needed
      setAuth(token, { provider: "google" })
      navigate("/dashboard", { replace: true })
    } else {
      navigate("/signin?error=oauth_missing_token", { replace: true })
    }
  }, [navigate])

  return null
}
