import type React from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Signup from "./routes/Signup"
import Signin from "./routes/Signin"
import Dashboard from "./routes/Dashboard"
import OAuthCallback from "./routes/OAuthCallback"
import { getToken } from "./auth"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = getToken()
  const location = useLocation()
  if (!token) return <Navigate to="/signin" replace state={{ from: location }} />
  return <>{children}</>
}

function NotFound() {
  return (
    <div className="center">
      <div className="card">
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    </div>
  )
}
