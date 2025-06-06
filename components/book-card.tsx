"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download } from "lucide-react"
import { useState } from "react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/lib/auth"
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

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const [downloading, setDownloading] = useState(false)
  const { user } = useAuth()

  const handleDownload = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu untuk mengunduh buku")
      return
    }

    setDownloading(true)
    try {
      const blob = await apiClient.downloadBook(book.id.toString())
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${book.title}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Buku berhasil diunduh")
    } catch (error) {
      toast.error("Gagal mengunduh buku")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] relative bg-gray-100">
        {book.cover_image ? (
          <Image src={book.cover_image || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-green-400">
            <div className="text-white text-center p-4">
              <div className="text-lg font-bold mb-2">{book.title}</div>
              <div className="text-sm opacity-90">{book.author}</div>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{book.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded">{book.category}</span>
          {book.formatted_file_size && <span>{book.formatted_file_size}</span>}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            size="sm"
          >
            <Download className="w-4 h-4 mr-1" />
            {downloading ? "Mengunduh..." : "Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
