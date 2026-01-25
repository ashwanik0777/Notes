import { NextResponse } from "next/server"
import { getTokenFromCookies } from "@/lib/jwt"
import { dbConnect } from "@/lib/db"
import { Note } from "@/models/Note"

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  try {
  await dbConnect()
    const jwt = getTokenFromCookies()
    if (!jwt) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const id = ctx.params.id
    const note = await Note.findOne({ _id: id, userId: jwt.sub })
    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 })
    await Note.deleteOne({ _id: id })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}
