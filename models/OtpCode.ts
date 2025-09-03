import { Schema, model, models } from "mongoose"

const OtpCodeSchema = new Schema(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const OtpCode = models.OtpCode || model("OtpCode", OtpCodeSchema)
