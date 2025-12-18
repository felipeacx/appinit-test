import { NextRequest, NextResponse } from "next/server"
import { mockUsers } from "../users"

export async function POST(request: NextRequest) {
  try {
    const { email, password: _password } = await request.json()

    if (!email || !_password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const user = mockUsers.find((u) => u.email === email && u.password === _password)

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword, { status: 200 })
    }

    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
