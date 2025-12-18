"use client"

import { useGlobalContext } from "@/app/context/GlobalContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { isAuthenticated, isLoading } = useGlobalContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
      <p className="text-lg text-gray-600">Redirigiendo...</p>
    </div>
  )
}
