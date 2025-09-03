// You can implement Mongoose models here when ready to use MongoDB.
import type { User, Note } from "../types"
import type { UserRepository } from "./UserRepository"
import type { NoteRepository } from "./NoteRepository"

// Placeholder implementations (throw) to signal not yet wired
export class MongoUserRepo implements UserRepository {
  async findByEmail(_email: string): Promise<User | null> {
    throw new Error("MongoUserRepo not implemented yet.")
  }
  async findById(_id: string): Promise<User | null> {
    throw new Error("MongoUserRepo not implemented yet.")
  }
  async create(_user: Omit<User, "id" | "createdAt">): Promise<User> {
    throw new Error("MongoUserRepo not implemented yet.")
  }
}

export class MongoNoteRepo implements NoteRepository {
  async listByUser(_userId: string): Promise<Note[]> {
    throw new Error("MongoNoteRepo not implemented yet.")
  }
  async create(_note: Omit<Note, "id" | "createdAt">): Promise<Note> {
    throw new Error("MongoNoteRepo not implemented yet.")
  }
  async delete(_userId: string, _noteId: string): Promise<boolean> {
    throw new Error("MongoNoteRepo not implemented yet.")
  }
}
