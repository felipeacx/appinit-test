import React from "react"
import { render, screen } from "@testing-library/react"
import { ProtectedRoute } from "../../components/ProtectedRoute"

// Simular el hook useGlobalContext
jest.mock("../../context/GlobalContext", () => ({
  useGlobalContext: jest.fn(),
}))

// Simular useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

import { useGlobalContext } from "../../context/GlobalContext"
import { useRouter } from "next/navigation"

describe("ProtectedRoute", () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it("debe mostrar estado de carga cuando isLoading es verdadero", () => {
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText("Cargando...")).toBeInTheDocument()
  })

  it("debe redirigir a inicio de sesión cuando no está autenticado y no está cargando", () => {
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockPush).toHaveBeenCalledWith("/login")
  })

  it("debe renderizar children cuando está autenticado", () => {
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText("Protected Content")).toBeInTheDocument()
  })

  it("no debe renderizar children cuando no está autenticado", () => {
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(container.textContent).not.toContain("Protected Content")
  })

  it("debe tener elemento de animación de carga", () => {
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    })

    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    const loadingDiv = container.querySelector(".animate-spin")
    expect(loadingDiv).toBeInTheDocument()
  })
})
