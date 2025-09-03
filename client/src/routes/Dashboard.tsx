"use client"

import { useEffect, useState } from "react"
import { getUser, clearAuth } from "../auth"
import { api } from "../api"

type Note = { id: string; content: string; createdAt: string }

export default function Dashboard() {
  const user = getUser<{ fullName?: string; email?: string }>()
  const [notes, setNotes] = useState<Note[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    try {
      const { notes } = await api.listNotes()
      setNotes(notes)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function createNote() {
    if (!content.trim()) return
    try {
      const { note } = await api.createNote(content.trim())
      setNotes((n) => [note, ...n])
      setContent("")
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function removeNote(id: string) {
    try {
      await api.deleteNote(id)
      setNotes((n) => n.filter((x) => x.id !== id))
    } catch (e: any) {
      setError(e.message)
    }
  }

  function logout() {
    clearAuth()
    window.location.href = "/signin"
  }

  return (
    <div className="dash-wrap">
      <header className="dash-header">
        <div className="brand">
          <div className="brand-dot" aria-hidden="true"></div>
          <span className="brand-text">HD</span>
        </div>
        <button className="btn-outline small-btn" onClick={logout}>
          Log out
        </button>
      </header>

      <main className="dash-main">
        <div className="card">
          <h2 className="title-sm">Welcome, {user?.fullName || "User"}!</h2>
          {user?.email ? <p className="subtitle">{user.email}</p> : null}

          <div className="note-create">
            <textarea
              className="textarea"
              placeholder="Write a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <button className="btn" onClick={createNote}>
              Create Note
            </button>
          </div>

          {loading ? <p>Loading notes...</p> : null}
          {error ? <p className="error-center">{error}</p> : null}

          <ul className="notes">
            {notes.map((n) => (
              <li key={n.id} className="note">
                <div className="note-content">{n.content}</div>
                <button className="icon-btn" aria-label="Delete note" onClick={() => removeNote(n.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
