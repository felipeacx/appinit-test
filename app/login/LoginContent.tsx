"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGlobalContext } from "@/app/context/GlobalContext"
import { BiWallet, BiShow, BiHide, BiError } from "react-icons/bi"
import ThemeToggle from "@/app/components/ThemeToggle"

export function LoginContent() {
  const [isMounted, setIsMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useGlobalContext()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!validateEmail(email)) {
      newErrors.email = "Ingresa un email válido"
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida"
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : "Error al iniciar sesión. Por favor, intenta de nuevo."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewerLogin = async () => {
    setIsLoading(true)
    setGeneralError("")

    try {
      await login("usuario@example.com", "password123")
      router.push("/dashboard")
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : "Error al iniciar sesión como viewer. Por favor, intenta de nuevo."
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return <div className="min-h-screen" />
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(135deg, #5C2E7F 0%, #3A1650 100%)" }}
    >
      <ThemeToggle />
      <div className="w-full max-w-md rounded-2xl shadow-2xl p-8 sm:p-10 animate-slide-in bg-base">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto bg-primary">
            <BiWallet className="text-2xl text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-primary">Finanzas App</h1>
          <p className="text-text-secondary">Gestiona tus finanzas de forma inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
          <div suppressHydrationWarning>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-text">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) {
                  setErrors({ ...errors, email: "" })
                }
              }}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-lg focus:outline-none transition border-2 bg-base text-text border-border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              suppressHydrationWarning
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error" id="email-error" role="alert">
                {errors.email}
              </p>
            )}
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-text">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) {
                    setErrors({ ...errors, password: "" })
                  }
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg focus:outline-none transition border-2 bg-base text-text border-border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                suppressHydrationWarning
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition text-text-secondary p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                disabled={isLoading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <BiHide className="text-lg" aria-hidden="true" />
                ) : (
                  <BiShow className="text-lg" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-error" id="password-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white hover:opacity-90 disabled:opacity-70 font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  aria-hidden="true"
                ></span>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          <button
            type="button"
            onClick={handleViewerLogin}
            disabled={isLoading}
            className="w-full bg-primary text-white hover:opacity-90 disabled:opacity-70 font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Entrar como Viewer
          </button>
        </form>

        {generalError && (
          <div
            className="my-4 p-4 border border-error rounded-lg text-sm animate-slide-in bg-error/10 text-error"
            role="alert"
            aria-live="assertive"
          >
            <p className="font-semibold mb-1 flex items-center gap-2">
              <BiError className="text-lg" aria-hidden="true" /> Error
            </p>
            {generalError}
          </div>
        )}

        <div className="mt-6 p-4 border border-border rounded-lg text-sm bg-bg-secondary">
          <p className="font-semibold mb-2 flex items-center gap-2 text-primary">
            <BiWallet className="text-lg" aria-hidden="true" /> Credenciales de prueba:
          </p>
          <div>
            <p className="text-text">
              <strong>Email:</strong> <code className="font-mono font-bold">test@example.com</code>
            </p>
            <p className="text-text">
              <strong>Contraseña:</strong> <code className="font-mono font-bold">123456</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
