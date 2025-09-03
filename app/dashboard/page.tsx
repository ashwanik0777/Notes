import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { Button } from "@/components/ui/button"
import NotesClient from "./notes-client"

export default async function DashboardPage() {
  const token = cookies().get("token")?.value
  const user = token ? verifyToken(token) : null

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg">You are not signed in.</p>
          <div className="mt-4 flex gap-3 justify-center">
            <a className="underline" href="/signin">
              Sign in
            </a>
            <a className="underline" href="/signup">
              Sign up
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-balance">Welcome, {user.name || user.email}!</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="outline">
              Log out
            </Button>
          </form>
        </div>

        <NotesClient />
      </div>
    </main>
  )
}
