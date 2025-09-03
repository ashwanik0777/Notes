import { Schema, model, models } from "mongoose"

const UserSchema = new Schema(
  {
    fullName: { type: String },
    dob: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    provider: { type: String, enum: ["otp", "google"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export type UserDoc = {
  _id: string
  fullName?: string
  dob?: string
  email: string
  provider: "otp" | "google"
}

export const User = models.User || model("User", UserSchema)
