import { z } from "zod"

export const emailSchema = z.string().email("Please enter a valid email")
export const otpSchema = z.string().regex(/^\d{6}$/, "OTP must be a 6-digit code")

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(50),
  dob: z.string().min(4, "DOB is required"),
  email: emailSchema,
  otp: otpSchema,
})

export const signinSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
})

export type SignupInput = z.infer<typeof signupSchema>
export type SigninInput = z.infer<typeof signinSchema>
