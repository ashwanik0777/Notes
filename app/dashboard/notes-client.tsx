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
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full">
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
            className="flex-1 px-4 py-3 text-base rounded-lg shadow-sm border border-purple-200 focus:border-purple-400"
          />
          <Button
            onClick={createNote}
            disabled={creating || !text.trim()}
            className="px-6 py-3 text-base rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-md"
          >
            {creating ? "Creating..." : "Create Note"}
          </Button>
        </div>

        {isLoading && <p className="text-base text-muted-foreground">Loading notes...</p>}
        {error && <p className="text-base text-destructive">Failed to load notes.</p>}

        <ul className="space-y-3">
          {data?.notes?.map((n: any) => (
            <li
              key={n._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 p-4 gap-2 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-base text-pretty break-words max-w-full">{n.text}</div>
              <Button
                variant="ghost"
                onClick={() => deleteNote(n._id)}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg"
              >
                Delete
              </Button>
            </li>
          ))}
          {!isLoading && data?.notes?.length === 0 && (
            <li className="text-base text-muted-foreground text-center">No notes yet.</li>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
