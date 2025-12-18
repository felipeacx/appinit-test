"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { UserRole, canUserPerform } from "@/app/types/roles"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

interface Transaction {
  id: string
  userId: string
  titulo: string
  cantidad: number
  tipo: "ingreso" | "gasto"
  categoria: string
  fecha: string
}

interface GlobalContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  transactions: Transaction[]
  transactionsLoading: boolean
  allUsers: User[]
  userRole: UserRole | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  fetchTransactions: () => Promise<void>
  fetchAllUsers: () => Promise<void>
  addTransaction: (transaction: Omit<Transaction, "id" | "userId">) => Promise<void>
  updateTransaction: (id: string, transaction: Omit<Transaction, "id" | "userId">) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  canUserPerformAction: (permission: string) => boolean
  [key: string]: unknown
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])

  useEffect(() => {
    setIsMounted(true)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error al parsear usuario guardado:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const userData = await response.json()
      setUserState(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    setUserState(null)
    setTransactions([])
    setAllUsers([])
    localStorage.removeItem("user")
  }

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser))
    } else {
      localStorage.removeItem("user")
    }
  }

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return

    setTransactionsLoading(true)
    try {
      const response = await fetch(`/api/transactions?userId=${user.id}`, {
        cache: "force-cache",
        headers: {
          "Cache-Control": "max-age=60",
        },
      })
      if (!response.ok) throw new Error("Failed to fetch transactions")
      const data = await response.json()
      setTransactions(Array.isArray(data.data) ? data.data : data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setTransactions([])
    } finally {
      setTransactionsLoading(false)
    }
  }, [user?.id])

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setAllUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }, [])

  const addTransaction = async (transaction: Omit<Transaction, "id" | "userId">) => {
    if (!user?.id) return

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...transaction, userId: user.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          Array.isArray(errorData.error)
            ? errorData.error.join(", ")
            : errorData.error || "Failed to add transaction"
        )
      }

      const newTransaction = await response.json()
      setTransactions([newTransaction, ...transactions])
    } catch (error) {
      console.error("Error adding transaction:", error)
      throw error
    }
  }

  const updateTransaction = async (id: string, transaction: Omit<Transaction, "id" | "userId">) => {
    try {
      setTransactions(transactions.map((t) => (t.id === id ? { ...t, ...transaction } : t)))
    } catch (error) {
      console.error("Error updating transaction:", error)
      throw error
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      setTransactions(transactions.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting transaction:", error)
      throw error
    }
  }

  const canUserPerformAction = (permission: string): boolean => {
    if (!user?.role) return false
    return canUserPerform(user.role, permission as Parameters<typeof canUserPerform>[1])
  }

  useEffect(() => {
    if (user?.id) {
      fetchTransactions()
      fetchAllUsers()
    }
  }, [user?.id, fetchTransactions, fetchAllUsers])

  const value: GlobalContextType = {
    user,
    isLoading: !isMounted ? true : isLoading,
    isAuthenticated: !!user,
    transactions,
    transactionsLoading,
    allUsers,
    userRole: user?.role || null,
    login,
    logout,
    setUser,
    fetchTransactions,
    fetchAllUsers,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    canUserPerformAction,
  }

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

export function useGlobalContext() {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalProvider")
  }
  return context
}
