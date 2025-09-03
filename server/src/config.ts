// Basic config and repository selection
import dotenv from "dotenv"
dotenv.config()

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000
export const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me"
export const APP_URL = process.env.APP_URL || "http://localhost:5173"
export const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`
export const MONGO_URI = process.env.MONGO_URI || ""
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""
export const USE_MONGO = Boolean(MONGO_URI)
export const DEV_MODE = process.env.NODE_ENV !== "production"
