export type User = {
  id: string
  email: string
  fullName?: string
  dob?: string // ISO date string
  provider: "local" | "google"
  createdAt: Date
}

export type Note = {
  id: string
  userId: string
  content: string
  createdAt: Date
}

export type OTPRecord = {
  email: string
  code: string
  expiresAt: Date
}
