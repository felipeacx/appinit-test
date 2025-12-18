"use client"

import { ProtectedRoute } from "@/app/components/ProtectedRoute"
import { AdminPanel } from "@/app/components/AdminPanel"
import { useGlobalContext } from "@/app/context/GlobalContext"
import { BiArrowBack } from "react-icons/bi"
import Link from "next/link"

export default function AdminPage() {
  const { user, canUserPerformAction } = useGlobalContext()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-bg-secondary rounded-lg transition text-primary"
            >
              <BiArrowBack className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary">
                Panel de Administración
              </h1>
              <p className="text-text-secondary">
                Usuario: <span className="font-semibold text-primary">{user?.name}</span>
              </p>
            </div>
          </div>

          {!canUserPerformAction("manage:users") ? (
            <div className="bg-error/10 border border-error/20 rounded-lg p-6">
              <p className="text-error font-semibold text-lg">
                No tienes permisos para acceder al panel de administración
              </p>
            </div>
          ) : (
            <AdminPanel />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
