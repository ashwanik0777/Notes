import { NextResponse } from "next/server"
import { getTokenFromCookies } from "@/lib/jwt"
import { getDb } from "@/lib/db"
import { Note } from "@/models/Note"

export async function GET() {
  try {
    await getDb()
    const jwt = getTokenFromCookies()
    if (!jwt) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const notes = await Note.find({ userId: jwt.sub }).sort({ createdAt: -1 })
    return NextResponse.json({ notes })
  } catch {
    return NextResponse.json({ error: "Failed to load notes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await getDb()
    const jwt = getTokenFromCookies()
    if (!jwt) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { text } = await req.json()
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Note text is required" }, { status: 400 })
    }
    const note = await Note.create({ userId: jwt.sub, text: text.trim() })
    return NextResponse.json({ note })
  } catch {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
