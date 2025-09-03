// Simple in-memory repositories for dev/local
import type { User, Note, OTPRecord } from "../types"
import type { UserRepository } from "./UserRepository"
import type { NoteRepository } from "./NoteRepository"
import { randomUUID } from "node:crypto"

export class InMemoryUserRepo implements UserRepository {
  private usersById = new Map<string, User>()
  private usersByEmail = new Map<string, User>()

  async findByEmail(email: string): Promise<User | null> {
    return this.usersByEmail.get(email.toLowerCase()) || null
  }

  async findById(id: string): Promise<User | null> {
    return this.usersById.get(id) || null
  }

  async create(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const id = randomUUID()
    const record: User = { id, createdAt: new Date(), ...user, email: user.email.toLowerCase() }
    this.usersById.set(id, record)
    this.usersByEmail.set(record.email, record)
    return record
  }
}

export class InMemoryNoteRepo implements NoteRepository {
  private notesByUser = new Map<string, Note[]>()

  async listByUser(userId: string): Promise<Note[]> {
    return this.notesByUser.get(userId) || []
  }

  async create(note: Omit<Note, "id" | "createdAt">): Promise<Note> {
    const record: Note = { id: randomUUID(), createdAt: new Date(), ...note }
    const list = this.notesByUser.get(note.userId) || []
    list.unshift(record)
    this.notesByUser.set(note.userId, list)
    return record
  }

  async delete(userId: string, noteId: string): Promise<boolean> {
    const list = this.notesByUser.get(userId) || []
    const next = list.filter((n) => n.id !== noteId)
    const changed = next.length !== list.length
    if (changed) this.notesByUser.set(userId, next)
    return changed
  }
}

// Very simple in-memory OTP store (ephemeral)
export class InMemoryOTPStore {
  private otps = new Map<string, OTPRecord>() // key = email

  set(email: string, code: string, ttlMs = 5 * 60 * 1000) {
    this.otps.set(email.toLowerCase(), { email: email.toLowerCase(), code, expiresAt: new Date(Date.now() + ttlMs) })
  }

  verify(email: string, code: string): boolean {
    const rec = this.otps.get(email.toLowerCase())
    if (!rec) return false
    const ok = rec.code === code && rec.expiresAt.getTime() > Date.now()
    if (ok) this.otps.delete(email.toLowerCase())
    return ok
  }
}
