import { Router } from "express"
import { z } from "zod"
import { requireAuth, type AuthedRequest } from "../middleware/auth"

type Deps = {
  notes: {
    listByUser(userId: string): Promise<any[]>
    create(note: { userId: string; content: string }): Promise<any>
    delete(userId: string, noteId: string): Promise<boolean>
  }
}

const createSchema = z.object({ content: z.string().min(1, "Note cannot be empty").max(1000, "Max 1000 characters") })

export function notesRouter(deps: Deps) {
  const router = Router()
  router.use(requireAuth)

  router.get("/", async (req: AuthedRequest, res) => {
    const userId = req.user!.id
    const list = await deps.notes.listByUser(userId)
    return res.json({ notes: list })
  })

  router.post("/", async (req: AuthedRequest, res) => {
    try {
      const { content } = createSchema.parse(req.body || {})
      const note = await deps.notes.create({ userId: req.user!.id, content })
      return res.status(201).json({ note })
    } catch (e: any) {
      return res.status(400).json({ error: e?.errors?.[0]?.message || "Invalid input" })
    }
  })

  router.delete("/:id", async (req: AuthedRequest, res) => {
    const ok = await deps.notes.delete(req.user!.id, req.params.id)
    if (!ok) return res.status(404).json({ error: "Note not found" })
    return res.json({ ok: true })
  })

  return router
}
