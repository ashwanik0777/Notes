import express from "express"
import cors from "cors"
import passport from "passport"
import cookieParser from "cookie-parser"
import { PORT } from "./config"
import { authRouter } from "./routes/auth"
import { notesRouter } from "./routes/notes"
import { InMemoryNoteRepo, InMemoryOTPStore, InMemoryUserRepo } from "./repositories/InMemory"
// import mongoose from "mongoose";
// import { MongoNoteRepo, MongoUserRepo } from "./repositories/Mongo";

async function bootstrap() {
  // Choose repositories
  // For now, use in-memory; switch to Mongo later
  // if (USE_MONGO) await mongoose.connect(MONGO_URI);
  const users = new InMemoryUserRepo()
  const notes = new InMemoryNoteRepo()
  const otp = new InMemoryOTPStore()

  const app = express()
  app.use(cors({ origin: true, credentials: true }))
  app.use(express.json())
  app.use(cookieParser())
  app.use(passport.initialize())

  app.get("/health", (_req, res) => res.json({ ok: true }))

  app.use("/auth", authRouter({ users, otp }))
  app.use("/notes", notesRouter({ notes }))

  // Global error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  })

  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`)
  })
}

bootstrap().catch((e) => {
  console.error("Failed to start server:", e)
  process.exit(1)
})
