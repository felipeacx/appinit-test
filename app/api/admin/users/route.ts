import { NextRequest, NextResponse } from "next/server"
import { mockUsers } from "../../auth/users"
import { UserRole } from "@/app/types/roles"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const usersWithoutPasswords = mockUsers.map(({ password: _password, ...user }) => user)

    if (userId) {
      const user = usersWithoutPasswords.find((u) => u.id === userId)
      if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
      }
      return NextResponse.json(user)
    }

    return NextResponse.json(usersWithoutPasswords)
  } catch {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password: postPassword, name, role } = await request.json()

    if (!email || !postPassword || !name || !role) {
      return NextResponse.json(
        { error: "email, password, name y role son requeridos" },
        { status: 400 }
      )
    }

    if (!["admin", "user", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Role inválido" }, { status: 400 })
    }

    if (mockUsers.some((u) => u.email === email)) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    const newUser = {
      id: String(Math.max(...mockUsers.map((u) => parseInt(u.id) || 0), 0) + 1),
      email,
      password: postPassword,
      name,
      role: role as UserRole,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    mockUsers.push(newUser)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, role, email } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "id es requerido" }, { status: 400 })
    }

    const userIndex = mockUsers.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    if (role && !["admin", "user", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Role inválido" }, { status: 400 })
    }

    if (name) mockUsers[userIndex].name = name
    if (role) mockUsers[userIndex].role = role as UserRole
    if (email && email !== mockUsers[userIndex].email) {
      if (mockUsers.some((u) => u.email === email && u.id !== id)) {
        return NextResponse.json({ error: "El email ya está en uso" }, { status: 409 })
      }
      mockUsers[userIndex].email = email
    }
    mockUsers[userIndex].updatedAt = new Date().toISOString().split("T")[0]

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex]
    return NextResponse.json(userWithoutPassword)
  } catch {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id es requerido" }, { status: 400 })
    }

    const userIndex = mockUsers.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    if (mockUsers[userIndex].role === "admin" && mockUsers.length <= 1) {
      return NextResponse.json(
        { error: "No se puede eliminar el último administrador" },
        { status: 403 }
      )
    }

    mockUsers.splice(userIndex, 1)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
