"use client"

import { useState, useEffect } from "react"
import { useGlobalContext } from "@/app/context/GlobalContext"
import { BiPlus, BiTrash, BiPencil, BiX } from "react-icons/bi"

interface User {
  id: string
  email: string
  password?: string
  name: string
  role: "admin" | "user" | "viewer"
  createdAt: string
  updatedAt: string
}

interface UserFormData {
  email: string
  password: string
  name: string
  role: "admin" | "user" | "viewer"
}

export function AdminPanel() {
  const { allUsers, fetchAllUsers, canUserPerformAction } = useGlobalContext()
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    name: "",
    role: "user",
  })
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

  if (!canUserPerformAction("manage:users")) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-lg p-4">
        <p className="text-error font-semibold">No tienes permisos para gestionar usuarios</p>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const method = editingUser ? "PUT" : "POST"
      const body = editingUser ? { id: editingUser.id, ...formData } : formData

      const response = await fetch("/api/admin/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al procesar la solicitud")
      }

      setSuccessMessage(
        editingUser ? "Usuario actualizado correctamente" : "Usuario creado correctamente"
      )
      setFormData({ email: "", password: "", name: "", role: "user" })
      setEditingUser(null)
      setShowForm(false)
      await fetchAllUsers()

      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: "",
      name: user.name,
      role: user.role,
    })
    setShowForm(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar usuario")
      }

      setSuccessMessage("Usuario eliminado correctamente")
      await fetchAllUsers()
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({ email: "", password: "", name: "", role: "user" })
    setError("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Gestión de Usuarios</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 flex items-center gap-2 transition"
        >
          <BiPlus /> Nuevo Usuario
        </button>
      </div>

      {}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <p className="text-error font-semibold">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-success font-semibold">{successMessage}</p>
        </div>
      )}

      {}
      {showForm && (
        <div className="bg-bg-secondary border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text">
              {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h3>
            <button
              onClick={handleCloseForm}
              className="p-2 hover:bg-bg-tertiary rounded-lg transition"
            >
              <BiX className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={editingUser ? true : false}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg focus:outline-none focus:border-primary text-text disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {editingUser ? "Nueva Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg focus:outline-none focus:border-primary text-text"
              >
                <option value="viewer">Visualizador</option>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 font-semibold"
              >
                {loading ? "Guardando..." : editingUser ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={handleCloseForm}
                className="flex-1 px-4 py-2 bg-bg-tertiary border border-border text-text rounded-lg hover:bg-bg-secondary transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {}
      <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-tertiary border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text">Rol</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text">Creado</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-text">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allUsers.map((user) => (
              <tr key={user.id} className="hover:bg-bg-tertiary transition">
                <td className="px-6 py-3 text-text font-medium">{user.name}</td>
                <td className="px-6 py-3 text-text-secondary">{user.email}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-error/20 text-error"
                        : user.role === "user"
                        ? "bg-primary/20 text-primary"
                        : "bg-text-secondary/20 text-text-secondary"
                    }`}
                  >
                    {user.role === "admin"
                      ? "Administrador"
                      : user.role === "user"
                      ? "Usuario"
                      : "Visualizador"}
                  </span>
                </td>
                <td className="px-6 py-3 text-text-secondary text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 hover:bg-bg-secondary rounded-lg transition text-primary"
                    >
                      <BiPencil />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 hover:bg-bg-secondary rounded-lg transition text-error"
                    >
                      <BiTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
