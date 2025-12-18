"use client"

import { Transaction } from "@/app/api/transactions/transactions"
import { useState, useEffect } from "react"
import { BiSearch, BiRotateLeft } from "react-icons/bi"

interface FilterOptions {
  tipo: string
  categoria: string
  orderBy: "fecha" | "cantidad" | "titulo"
  orderDirection: "asc" | "desc"
}

interface TransactionFiltersProps {
  transactions: Transaction[]
  onFiltered: (filtered: Transaction[]) => void
}

export function TransactionFilters({ transactions, onFiltered }: TransactionFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    tipo: "todos",
    categoria: "todos",
    orderBy: "fecha",
    orderDirection: "desc",
  })

  const categories = Array.from(new Set(transactions.map((t) => t.categoria))).sort()

  useEffect(() => {
    let filtered = [...transactions]

    if (filters.tipo !== "todos") {
      filtered = filtered.filter((t) => t.tipo === filters.tipo)
    }

    if (filters.categoria !== "todos") {
      filtered = filtered.filter((t) => t.categoria === filters.categoria)
    }

    filtered.sort((a, b) => {
      let compareA: number | string
      let compareB: number | string

      if (filters.orderBy === "fecha") {
        compareA = new Date(a.fecha).getTime()
        compareB = new Date(b.fecha).getTime()
      } else if (filters.orderBy === "cantidad") {
        compareA = a.cantidad
        compareB = b.cantidad
      } else {
        compareA = a.titulo.toLowerCase()
        compareB = b.titulo.toLowerCase()
      }

      if (filters.orderDirection === "asc") {
        return compareA > compareB ? 1 : compareA < compareB ? -1 : 0
      } else {
        return compareA < compareB ? 1 : compareA > compareB ? -1 : 0
      }
    })

    onFiltered(filtered)
  }, [filters, transactions, onFiltered])

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      tipo: "todos",
      categoria: "todos",
      orderBy: "fecha",
      orderDirection: "desc",
    })
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6 mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 text-text">
          <BiSearch className="text-xl" /> Filtros y Ordenamiento
        </h3>
        <button
          onClick={handleResetFilters}
          className="sm:w-auto w-full px-4 py-2 bg-primary text-white hover:opacity-90 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
        >
          <BiRotateLeft className="text-lg" /> Limpiar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {}
        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Tipo</label>
          <select
            value={filters.tipo}
            onChange={(e) => handleFilterChange("tipo", e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition border-2 border-border bg-base text-text"
          >
            <option value="todos">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
        </div>

        {}
        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Categoría</label>
          <select
            value={filters.categoria}
            onChange={(e) => handleFilterChange("categoria", e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition border-2 border-border bg-base text-text"
          >
            <option value="todos">Todas</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {}
        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Ordenar por</label>
          <select
            value={filters.orderBy}
            onChange={(e) =>
              handleFilterChange("orderBy", e.target.value as "fecha" | "cantidad" | "titulo")
            }
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition border-2 border-border bg-base text-text"
          >
            <option value="fecha">Fecha</option>
            <option value="cantidad">Cantidad</option>
            <option value="titulo">Título</option>
          </select>
        </div>

        {}
        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Dirección</label>
          <select
            value={filters.orderDirection}
            onChange={(e) => handleFilterChange("orderDirection", e.target.value as "asc" | "desc")}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition border-2 border-border bg-base text-text"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>
    </div>
  )
}
