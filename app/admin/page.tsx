"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, LogOut, User } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Book {
  id: number
  title: string
  author: string
  description: string
  category: string
  age_category: string
  cover_image?: string
  pdf_file?: string
  pages?: number
  published_year?: number
  isbn?: string
  language?: string
  is_active: boolean
  created_at: string
}

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const { user, logout, isAdmin } = useAuth()
  const router = useRouter()

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    age_category: "all",
    published_year: "",
    isbn: "",
    language: "Indonesian",
    pages: "",
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  useEffect(() => {
    if (!isAdmin) {
      router.push("/admin/login")
      return
    }
    fetchBooks()
  }, [isAdmin, router, search])

  const fetchBooks = async () => {
    try {
      const response = await apiClient.getAdminBooks({
        search: search || undefined,
      })
      setBooks(response.data.data)
    } catch (error) {
      toast.error("Gagal memuat daftar buku")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      category: "",
      age_category: "all",
      published_year: "",
      isbn: "",
      language: "Indonesian",
      pages: "",
    })
    setCoverFile(null)
    setPdfFile(null)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value)
    })

    if (coverFile) data.append("cover_image", coverFile)
    if (pdfFile) data.append("pdf_file", pdfFile)

    try {
      await apiClient.createBook(data)
      toast.success("Buku berhasil ditambahkan")
      setShowAddDialog(false)
      resetForm()
      fetchBooks()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menambahkan buku")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBook) return

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value)
    })

    if (coverFile) data.append("cover_image", coverFile)
    if (pdfFile) data.append("pdf_file", pdfFile)

    // Add _method for Laravel
    data.append("_method", "PUT")

    try {
      await apiClient.updateBook(editingBook.id.toString(), data)
      toast.success("Buku berhasil diperbarui")
      setShowEditDialog(false)
      setEditingBook(null)
      resetForm()
      fetchBooks()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui buku")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini?")) return

    try {
      await apiClient.deleteBook(id.toString())
      toast.success("Buku berhasil dihapus")
      fetchBooks()
    } catch (error) {
      toast.error("Gagal menghapus buku")
    }
  }

  const openEditDialog = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      age_category: book.age_category,
      published_year: book.published_year?.toString() || "",
      isbn: book.isbn || "",
      language: book.language || "Indonesian",
      pages: book.pages?.toString() || "",
    })
    setShowEditDialog(true)
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
                  <span>{user.name} (Admin)</span>
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

          {/* Controls */}
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

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Buku
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Buku Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Judul Buku *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Penulis *</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Kategori *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="age_category">Kategori Usia *</Label>
                      <Select
                        value={formData.age_category}
                        onValueChange={(value) => setFormData({ ...formData, age_category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="children">Anak-anak</SelectItem>
                          <SelectItem value="teen">Remaja</SelectItem>
                          <SelectItem value="adult">Dewasa</SelectItem>
                          <SelectItem value="all">Semua Usia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="published_year">Tahun Terbit</Label>
                      <Input
                        id="published_year"
                        type="number"
                        value={formData.published_year}
                        onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pages">Jumlah Halaman</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={formData.pages}
                        onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Bahasa</Label>
                      <Input
                        id="language"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cover">Cover Image</Label>
                      <Input
                        id="cover"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pdf">File PDF *</Label>
                      <Input
                        id="pdf"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                      Tambah Buku
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                      Batal
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        book.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(book)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(book.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Buku</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Judul Buku *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-author">Penulis *</Label>
                  <Input
                    id="edit-author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Deskripsi *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Kategori *</Label>
                  <Input
                    id="edit-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-age-category">Kategori Usia *</Label>
                  <Select
                    value={formData.age_category}
                    onValueChange={(value) => setFormData({ ...formData, age_category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Anak-anak</SelectItem>
                      <SelectItem value="teen">Remaja</SelectItem>
                      <SelectItem value="adult">Dewasa</SelectItem>
                      <SelectItem value="all">Semua Usia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-cover">Cover Image Baru</Label>
                  <Input
                    id="edit-cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pdf">File PDF Baru</Label>
                  <Input
                    id="edit-pdf"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  Update Buku
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false)
                    setEditingBook(null)
                    resetForm()
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
