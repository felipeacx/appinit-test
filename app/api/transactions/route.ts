import { NextResponse, NextRequest } from "next/server"
import { mockTransactions } from "./transactions"
import { setCache, clearCache, getCacheWithStale } from "@/app/lib/cache"

export interface Transaction {
  id: string
  userId: string
  titulo: string
  cantidad: number
  tipo: "ingreso" | "gasto"
  categoria: string
  fecha: string
}

const transactions = [...mockTransactions]

function validateTransaction(data: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.titulo || typeof data.titulo !== "string" || data.titulo.trim().length === 0) {
    errors.push("El título es requerido")
  } else if (typeof data.titulo === "string" && data.titulo.length > 100) {
    errors.push("El título no puede exceder 100 caracteres")
  }

  if (!data.cantidad || typeof data.cantidad !== "number" || isNaN(data.cantidad)) {
    errors.push("La cantidad es requerida y debe ser un número")
  } else if (typeof data.cantidad === "number" && data.cantidad <= 0) {
    errors.push("La cantidad debe ser mayor a 0")
  }

  if (!data.tipo || typeof data.tipo !== "string" || !["ingreso", "gasto"].includes(data.tipo)) {
    errors.push("El tipo debe ser 'ingreso' o 'gasto'")
  }

  if (!data.categoria || typeof data.categoria !== "string" || data.categoria.trim().length === 0) {
    errors.push("La categoría es requerida")
  } else if (typeof data.categoria === "string" && data.categoria.length > 50) {
    errors.push("La categoría no puede exceder 50 caracteres")
  }

  if (!data.fecha) {
    errors.push("La fecha es requerida")
  } else {
    const date = new Date(data.fecha as string)
    if (isNaN(date.getTime())) {
      errors.push("La fecha tiene un formato inválido")
    }
  }

  return { valid: errors.length === 0, errors }
}

const CACHE_KEY = "transactions_list"
const CACHE_CONFIG = { ttl: 300, staleTime: 60 }

export async function GET() {
  try {
    const { data: cached, isStale } = getCacheWithStale(CACHE_KEY)

    if (cached) {
      return NextResponse.json(
        { data: cached, fromCache: true, isStale },
        {
          headers: {
            "Cache-Control": isStale
              ? "public, max-age=1, stale-while-revalidate=300"
              : "public, max-age=60, s-maxage=120",
          },
        }
      )
    }

    const data = transactions

    setCache(CACHE_KEY, data, CACHE_CONFIG)

    return NextResponse.json(
      { data, fromCache: false, isStale: false },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=120",
        },
      }
    )
  } catch {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const validation = validateTransaction(data)
    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 })
    }

    const newTransaction = {
      id: Date.now().toString(),
      userId: "user-123",
      ...data,
      fecha: new Date().toISOString(),
    }

    transactions.unshift(newTransaction)

    clearCache(CACHE_KEY)

    return NextResponse.json(newTransaction, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
