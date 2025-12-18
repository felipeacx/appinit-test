"use client"

import { useGlobalContext } from "@/app/context/GlobalContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useGlobalContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <AiOutlineLoading3Quarters className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg font-semibold">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
