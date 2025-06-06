"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/books")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Hello</h1>
          <h2 className="text-3xl font-bold text-blue-600 mb-8">Tulisify Readers !</h2>

          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button className="bg-orange-600 hover:bg-orange-700 px-8">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
