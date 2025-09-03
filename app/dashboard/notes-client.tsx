"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function NotesClient() {
  const { data, error, mutate, isLoading } = useSWR("/api/notes", fetcher)
  const [text, setText] = useState("")
  const [creating, setCreating] = useState(false)

  const createNote = async () => {
    if (!text.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || "Failed to create note")
      setText("")
      mutate()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setCreating(false)
    }
  }

  const deleteNote = async (id: string) => {
    if (!confirm("Delete this note?")) return
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      alert(body.error || "Failed to delete")
      return
    }
    mutate()
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Write a new note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                createNote()
              }
            }}
          />
          <Button onClick={createNote} disabled={creating || !text.trim()}>
            {creating ? "Creating..." : "Create Note"}
          </Button>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading notes...</p>}
        {error && <p className="text-sm text-destructive">Failed to load notes.</p>}

        <ul className="space-y-2">
          {data?.notes?.map((n: any) => (
            <li key={n._id} className="flex items-center justify-between rounded-md border p-3">
              <div className="text-sm text-pretty">{n.text}</div>
              <Button variant="ghost" onClick={() => deleteNote(n._id)}>
                Delete
              </Button>
            </li>
          ))}
          {!isLoading && data?.notes?.length === 0 && <li className="text-sm text-muted-foreground">No notes yet.</li>}
        </ul>
      </CardContent>
    </Card>
  )
}
