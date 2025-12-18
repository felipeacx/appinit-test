"use client"

import { useState, useEffect } from "react"
import type { Transaction } from "@/app/api/transactions/transactions"
import { BiError } from "react-icons/bi"

interface TransactionModalProps {
  isOpen: boolean
  transaction?: Transaction
  onClose: () => void
  onSave: (transaction: Omit<Transaction, "id" | "userId">) => Promise<void>
}

interface FormErrors {
  [key: string]: string
}

const CATEGORIES = [
  "Trabajo",
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Entretenimiento",
  "Salud",
  "Compras",
  "Inversiones",
  "Otros",
]

export function TransactionModal({ isOpen, transaction, onClose, onSave }: TransactionModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    cantidad: "",
    tipo: "gasto" as "ingreso" | "gasto",
    categoria: "Otros",
    fecha: new Date().toISOString().split("T")[0],
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (transaction) {
      setFormData({
        titulo: transaction.titulo,
        cantidad: transaction.cantidad.toString(),
        tipo: transaction.tipo,
        categoria: transaction.categoria,
        fecha: transaction.fecha,
      })
    } else {
      setFormData({
        titulo: "",
        cantidad: "",
        tipo: "gasto",
        categoria: "Otros",
        fecha: new Date().toISOString().split("T")[0],
      })
    }
    setErrors({})
    setSubmitError(null)
  }, [transaction, isOpen])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido"
    } else if (formData.titulo.length > 100) {
      newErrors.titulo = "El título no puede exceder 100 caracteres"
    }

    if (!formData.cantidad) {
      newErrors.cantidad = "La cantidad es requerida"
    } else if (isNaN(Number(formData.cantidad))) {
      newErrors.cantidad = "La cantidad debe ser un número válido"
    } else if (Number(formData.cantidad) <= 0) {
      newErrors.cantidad = "La cantidad debe ser mayor a 0"
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = "La categoría es requerida"
    }

    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSave({
        titulo: formData.titulo.trim(),
        cantidad: Number(formData.cantidad),
        tipo: formData.tipo,
        categoria: formData.categoria,
        fecha: formData.fecha,
      })
      onClose()
    } catch (error) {
      console.error("Error saving transaction:", error)
      setSubmitError("Error al guardar la transacción. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-bg-secondary border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-in">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-2 text-primary">
            {transaction ? "Editar Transacción" : "Nueva Transacción"}
          </h2>
          <p className="text-sm mb-6 text-text-secondary">
            {transaction
              ? "Actualiza los datos de tu transacción"
              : "Registra una nueva transacción"}
          </p>

          {submitError && (
            <div className="mb-4 p-4 border border-error rounded-lg text-sm animate-slide-in bg-error/10 text-error">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <BiError className="text-lg" /> Error
              </p>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {}
            <div>
              <label className="block text-sm font-semibold mb-2 text-text">
                Título <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Salario, Compras, etc."
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition border-2 bg-base text-text ${
                  errors.titulo ? "border-error" : "border-border"
                }`}
              />
              {errors.titulo && (
                <p className="text-xs mt-1 font-semibold text-error">{errors.titulo}</p>
              )}
            </div>

            {}
            <div>
              <label className="block text-sm font-semibold mb-2 text-text">
                Cantidad <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition border-2 bg-base text-text ${
                  errors.cantidad ? "border-error" : "border-border"
                }`}
              />
              {errors.cantidad && (
                <p className="text-xs mt-1 font-semibold text-error">{errors.cantidad}</p>
              )}
            </div>

            {}
            <div>
              <label className="block text-sm font-semibold mb-2 text-text">
                Tipo <span className="text-error">*</span>
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition border-2 bg-base text-text ${
                  errors.tipo ? "border-error" : "border-border"
                }`}
              >
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
              </select>
              {errors.tipo && (
                <p className="text-xs mt-1 font-semibold text-error">{errors.tipo}</p>
              )}
            </div>

            {}
            <div>
              <label className="block text-sm font-semibold mb-2 text-text">
                Categoría <span className="text-error">*</span>
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition border-2 bg-base text-text ${
                  errors.categoria ? "border-error" : "border-border"
                }`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <p className="text-xs mt-1 font-semibold text-error">{errors.categoria}</p>
              )}
            </div>

            {}
            <div>
              <label className="block text-sm font-semibold mb-2 text-text">
                Fecha <span className="text-error">*</span>
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition border-2 bg-base text-text ${
                  errors.fecha ? "border-error" : "border-border"
                }`}
              />
              {errors.fecha && (
                <p className="text-xs mt-1 font-semibold text-error">{errors.fecha}</p>
              )}
            </div>

            {}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-border bg-base text-text font-bold rounded-lg hover:opacity-80 transition duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
