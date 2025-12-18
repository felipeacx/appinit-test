import { NextRequest, NextResponse } from "next/server"

export interface SharedTransaction {
  transactionId: string
  userId: string
  sharedWith: string
  permission: "read" | "edit"
  sharedAt: string
}

export const mockSharedTransactions: SharedTransaction[] = [
  {
    transactionId: "1",
    userId: "1",
    sharedWith: "2",
    permission: "read",
    sharedAt: "2024-12-10",
  },
  {
    transactionId: "3",
    userId: "2",
    sharedWith: "1",
    permission: "edit",
    sharedAt: "2024-12-11",
  },
]

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId es requerido" }, { status: 400 })
    }

    const sharedWithUser = mockSharedTransactions.filter((s) => s.sharedWith === userId)

    const sharedByUser = mockSharedTransactions.filter((s) => s.userId === userId)

    return NextResponse.json({
      sharedWithUser,
      sharedByUser,
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener permisos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { transactionId, sharedWith, permission } = await request.json()

    if (!transactionId || !sharedWith || !permission) {
      return NextResponse.json(
        { error: "transactionId, sharedWith y permission son requeridos" },
        { status: 400 }
      )
    }

    if (!["read", "edit"].includes(permission)) {
      return NextResponse.json({ error: "permission inválido" }, { status: 400 })
    }

    const newShare: SharedTransaction = {
      transactionId,
      userId: request.headers.get("x-user-id") || "",
      sharedWith,
      permission,
      sharedAt: new Date().toISOString().split("T")[0],
    }

    mockSharedTransactions.push(newShare)

    return NextResponse.json(newShare, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al compartir transacción" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const transactionId = request.nextUrl.searchParams.get("transactionId")
    const sharedWith = request.nextUrl.searchParams.get("sharedWith")

    if (!transactionId || !sharedWith) {
      return NextResponse.json(
        { error: "transactionId y sharedWith son requeridos" },
        { status: 400 }
      )
    }

    const index = mockSharedTransactions.findIndex(
      (s) => s.transactionId === transactionId && s.sharedWith === sharedWith
    )

    if (index > -1) {
      mockSharedTransactions.splice(index, 1)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al revocar permiso" }, { status: 500 })
  }
}
