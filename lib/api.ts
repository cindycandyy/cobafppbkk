const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token")

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || "Something went wrong")
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(name: string, email: string, password: string, password_confirmation: string) {
    return this.request("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, password_confirmation }),
    })
  }

  async logout() {
    return this.request("/logout", { method: "POST" })
  }

  async getProfile() {
    return this.request("/me")
  }

  // Books endpoints
  async getBooks(params?: { search?: string; category?: string; age_category?: string; page?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append("search", params.search)
    if (params?.category) searchParams.append("category", params.category)
    if (params?.age_category) searchParams.append("age_category", params.age_category)
    if (params?.page) searchParams.append("page", params.page.toString())

    const query = searchParams.toString()
    return this.request(`/books${query ? `?${query}` : ""}`)
  }

  async getBook(id: string) {
    return this.request(`/books/${id}`)
  }

  async downloadBook(id: string) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${this.baseURL}/books/${id}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error("Download failed")
    }

    return response.blob()
  }

  async getCategories() {
    return this.request("/books/categories/list")
  }

  async getAgeCategories() {
    return this.request("/books/age-categories/list")
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request("/admin/dashboard")
  }

  async getAdminBooks(params?: { search?: string; status?: string; page?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append("search", params.search)
    if (params?.status) searchParams.append("status", params.status)
    if (params?.page) searchParams.append("page", params.page.toString())

    const query = searchParams.toString()
    return this.request(`/admin/books${query ? `?${query}` : ""}`)
  }

  async createBook(formData: FormData) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${this.baseURL}/admin/books`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || "Something went wrong")
    }

    return response.json()
  }

  async updateBook(id: string, formData: FormData) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${this.baseURL}/admin/books/${id}`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || "Something went wrong")
    }

    return response.json()
  }

  async deleteBook(id: string) {
    return this.request(`/admin/books/${id}`, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
