import type { Note } from "../types"

export interface NoteRepository {
  listByUser(userId: string): Promise<Note[]>
  create(note: Omit<Note, "id" | "createdAt">): Promise<Note>
  delete(userId: string, noteId: string): Promise<boolean>
}
