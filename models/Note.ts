import { Schema, model, models } from "mongoose"

const NoteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
)

export type NoteDoc = {
  _id: string
  userId: string
  text: string
  createdAt: string
}

export const Note = models.Note || model("Note", NoteSchema)
