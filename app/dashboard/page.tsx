

import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { Button } from "@/components/ui/button"
import NotesClient from "./notes-client"
import { LogOut } from "lucide-react"

export default async function DashboardPage() {
  const token = cookies().get("token")?.value
  const user = token ? verifyToken(token) : null

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-tr from-purple-200 via-blue-100 to-pink-200">
        <div className="text-center bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl px-6 py-10 sm:px-10 sm:py-12 max-w-md w-full">
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
            You are not signed in.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <a
              href="/signin"
              className="px-6 py-3 rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition text-base font-medium shadow-md"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="px-6 py-3 rounded-lg text-purple-700 border-2 border-purple-700 hover:bg-purple-700 hover:text-white transition text-base font-medium shadow-md"
            >
              Sign up
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-2 sm:p-6 md:p-10 bg-gradient-to-tr from-purple-200 via-blue-100 to-pink-200 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 space-y-8">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold uppercase shadow-lg">
              {(user.name || user.email)?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Welcome, {user.name || user.email}!
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-300">{user.email}</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="post" className="flex-shrink-0">
            <Button
              type="submit"
              variant="outline"
              className="flex items-center gap-2 px-5 py-2 font-semibold hover:bg-red-600 hover:text-white transition border-red-200 hover:border-red-600"
            >
              <LogOut size={18} />
              Log out
            </Button>
          </form>
        </header>

        <section className="overflow-auto">
          <NotesClient />
        </section>
      </div>
    </main>
  )
}
