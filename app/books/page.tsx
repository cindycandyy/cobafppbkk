"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import { BookCard } from "@/components/book-card"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, User, LogOut } from "lucide-react"
import { toast } from "sonner"

interface Book {
  id: number
  title: string
  author: string
  description: string
  category: string
  age_category: string
  cover_image?: string
  formatted_file_size?: string
  pages?: number
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [ageCategory, setAgeCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const { user, logout } = useAuth()

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [search, category, ageCategory])

  const fetchBooks = async () => {
    try {
      const response = await apiClient.getBooks({
        search: search || undefined,
        category: category || undefined,
        age_category: ageCategory || undefined,
      })
      setBooks(response.data.data)
    } catch (error) {
      toast.error("Gagal memuat daftar buku")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error("Failed to fetch categories")
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("Logout berhasil")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" />

            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </div>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Daftar Buku</h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari buku atau penulis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ageCategory} onValueChange={setAgeCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Semua Usia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Usia</SelectItem>
                <SelectItem value="children">Anak-anak</SelectItem>
                <SelectItem value="teen">Remaja</SelectItem>
                <SelectItem value="adult">Dewasa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada buku yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
