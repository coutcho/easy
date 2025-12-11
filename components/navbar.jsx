"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { setAuthToken } from "@/lib/axios"
import { Vote, BarChart3, LogOut, LogIn } from "lucide-react"

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    setAuthToken(null)
    logout()
    router.push("/")
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <Vote className="h-6 w-6" />
          VoteApp
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/vote">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Vote className="h-4 w-4" />
                  Vote
                </Button>
              </Link>
              <Link href="/results">
                <Button variant="ghost" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Results
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/">
              <Button className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
