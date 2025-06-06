"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "./api"

interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => void
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      apiClient
        .getProfile()
        .then((response) => {
          setUser(response.data)
        })
        .catch(() => {
          localStorage.removeItem("token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password)
    localStorage.setItem("token", response.data.token)
    setUser(response.data.user)
  }

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const response = await apiClient.register(name, email, password, passwordConfirmation)
    localStorage.setItem("token", response.data.token)
    setUser(response.data.user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    apiClient.logout().catch(() => {})
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
