"use client"

import { ProtectedRoute } from "@/app/components/ProtectedRoute"
import { TransactionFilters } from "@/app/components/TransactionFilters"
import { TransactionModal } from "@/app/components/TransactionModal"
import { useGlobalContext } from "@/app/context/GlobalContext"
import { useNotifications } from "@/app/context/NotificationContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { Transaction } from "@/app/api/transactions/transactions"
import Link from "next/link"
import {
  BiLineChart,
  BiPlus,
  BiLogOut,
  BiCheckCircle,
  BiError,
  BiPencil,
  BiTrash,
  BiCog,
} from "react-icons/bi"
import { MdTrendingUp, MdTrendingDown } from "react-icons/md"
import { AiChat } from "../components/AiChat"
import { SkipLink } from "../components/SkipLink"

export default function Dashboard() {
  const {
    user,
    logout,
    transactions,
    transactionsLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    canUserPerformAction,
  } = useGlobalContext()
  const { success, error: showError } = useNotifications()
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const router = useRouter()

  useEffect(() => {
    setFilteredTransactions(transactions)
  }, [transactions])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const totalIngresos = filteredTransactions
    .filter((t) => t.tipo === "ingreso")
    .reduce((sum, t) => sum + t.cantidad, 0)

  const totalGastos = filteredTransactions
    .filter((t) => t.tipo === "gasto")
    .reduce((sum, t) => sum + t.cantidad, 0)

  const balanceNeto = totalIngresos - totalGastos

  const handleAddTransaction = async (transaction: Omit<Transaction, "id" | "userId">) => {
    try {
      await addTransaction(transaction)
      setIsModalOpen(false)
      setEditingTransaction(undefined)
      success("Transacción creada", `${transaction.titulo} ha sido agregada correctamente`)
    } catch (error) {
      showError("Error", "Error al guardar la transacción")
      console.error("Error al guardar la transacción:", error)
    }
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleUpdateTransaction = async (transaction: Omit<Transaction, "id" | "userId">) => {
    if (!editingTransaction) return
    try {
      await updateTransaction(editingTransaction.id, transaction)
      setIsModalOpen(false)
      setEditingTransaction(undefined)
      success("Transacción actualizada", `${transaction.titulo} ha sido actualizada correctamente`)
    } catch (error) {
      showError("Error", "Error al actualizar la transacción")
      console.error("Error al actualizar la transacción:", error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta transacción?")) {
      try {
        await deleteTransaction(id)
        success("Transacción eliminada", "La transacción ha sido eliminada correctamente")
      } catch (error) {
        showError("Error", "Error al eliminar la transacción")
        console.error("Error al eliminar la transacción:", error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(undefined)
  }

  return (
    <ProtectedRoute>
      <SkipLink />
      <div id="main-content" className="min-h-screen bg-base p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8 animate-slide-in bg-linear-to-r from-primary/5 to-primary-light/5 border border-primary/20 rounded-xl p-6 sm:p-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-2 text-primary">
                <BiLineChart className="text-3xl sm:text-4xl" /> Dashboard
              </h1>
              <p className="text-text-secondary">
                Bienvenido, <span className="font-semibold text-primary">{user?.name}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {canUserPerformAction("manage:users") && (
                <Link
                  href="/admin"
                  className="flex-1 sm:flex-none px-6 py-3 bg-primary text-white hover:opacity-90 font-bold rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <BiCog className="text-lg" /> Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none px-6 py-3 bg-error text-white hover:opacity-90 font-bold rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <BiLogOut className="text-lg" /> Cerrar Sesión
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-bg-secondary border border-border rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-text">Total Ingresos</h3>
                <MdTrendingUp className="text-2xl text-success" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-success">
                ${totalIngresos.toLocaleString("es-CO")}
              </p>
            </div>
            <div className="bg-bg-secondary border border-border rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-text">Total Gastos</h3>
                <MdTrendingDown className="text-2xl text-error" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-error">
                ${totalGastos.toLocaleString("es-CO")}
              </p>
            </div>
            <div
              className={`bg-bg-secondary rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition border-2 ${
                balanceNeto >= 0
                  ? "border-primary/40 bg-linear-to-br from-primary/5 to-transparent"
                  : "border-error/40 bg-linear-to-br from-error/5 to-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-text">Balance Neto</h3>
                {balanceNeto >= 0 ? (
                  <BiCheckCircle className="text-2xl text-success" />
                ) : (
                  <BiError className="text-2xl text-error" />
                )}
              </div>
              <p
                className={`text-3xl sm:text-4xl font-bold ${
                  balanceNeto >= 0 ? "text-success" : "text-error"
                }`}
              >
                ${balanceNeto.toLocaleString("es-CO")}
              </p>
            </div>
          </div>
          {!transactionsLoading && transactions.length > 0 && (
            <TransactionFilters transactions={transactions} onFiltered={setFilteredTransactions} />
          )}
          <div className="flex flex-row items-center justify-end">
            <button
              onClick={() => {
                setEditingTransaction(undefined)
                setIsModalOpen(true)
              }}
              className="flex-1 sm:flex-none px-6 py-3 bg-success text-white hover:opacity-90 font-bold rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 my-3"
            >
              <BiPlus className="text-lg" /> Nueva
            </button>
          </div>
          <div className="bg-bg-secondary border border-border rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-primary/20 bg-linear-to-r from-primary/5 to-transparent">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
                <BiLineChart /> Transacciones Recientes
              </h2>
            </div>
            {transactionsLoading ? (
              <div className="text-center py-12">
                <p className="text-text-secondary">Cargando transacciones...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12 px-6">
                <p className="text-text-secondary">
                  {transactions.length === 0
                    ? "No hay transacciones registradas aún"
                    : "No hay transacciones que coincidan con los filtros"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-base border-b border-border">
                    <tr>
                      <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-text-secondary">
                        Título
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold hidden sm:table-cell text-text-secondary">
                        Categoría
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold hidden sm:table-cell text-text-secondary">
                        Tipo
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold text-text-secondary">
                        Cantidad
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold hidden md:table-cell text-text-secondary">
                        Fecha
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-text-secondary">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTransactions.map((transaction) => {
                      const isIncome = transaction.tipo === "ingreso"
                      const amountColor = isIncome ? "text-success" : "text-error"
                      const sign = isIncome ? "+" : "-"
                      return (
                        <tr
                          key={transaction.id}
                          className="odd:bg-bg-secondary even:bg-base hover:opacity-80 transition"
                        >
                          <td className="px-4 sm:px-6 py-4 text-sm font-medium text-text">
                            {transaction.titulo}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm hidden sm:table-cell text-text-secondary">
                            {transaction.categoria}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm hidden sm:table-cell">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                                isIncome ? "bg-success/10 text-success" : "bg-error/10 text-error"
                              }`}
                            >
                              {isIncome ? (
                                <span className="flex items-center gap-1">
                                  <MdTrendingUp className="inline" /> Ingreso
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <MdTrendingDown className="inline" /> Gasto
                                </span>
                              )}
                            </span>
                          </td>
                          <td
                            className={`px-4 sm:px-6 py-4 text-sm font-bold text-right ${amountColor}`}
                          >
                            {sign}${transaction.cantidad.toLocaleString("es-CO")}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm hidden md:table-cell text-text-secondary">
                            {new Date(transaction.fecha).toLocaleDateString("es-CO")}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-center space-x-2">
                            <button
                              onClick={() => handleEditTransaction(transaction)}
                              className="text-primary hover:opacity-80 font-semibold transition"
                            >
                              <BiPencil className="inline text-lg" />
                            </button>

                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="text-error hover:opacity-80 font-semibold transition"
                            >
                              <BiTrash className="inline text-lg" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      <TransactionModal
        isOpen={isModalOpen}
        transaction={editingTransaction}
        onClose={handleCloseModal}
        onSave={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
      />

      {}
      <AiChat />
    </ProtectedRoute>
  )
}
