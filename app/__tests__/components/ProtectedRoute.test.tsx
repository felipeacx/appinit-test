import React from "react"
import { render, screen } from "@testing-library/react"
import { ProtectedRoute } from "../../components/ProtectedRoute"

// Mock the useGlobalContext hook
jest.mock("../../context/GlobalContext", () => ({
  useGlobalContext: jest.fn(),
}))

// Mock useRouter
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

  it("should show loading state when isLoading is true", () => {
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

  it("should redirect to login when not authenticated and not loading", () => {
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

  it("should render children when authenticated", () => {
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

  it("should not render children when not authenticated", () => {
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

  it("should have loading animation element", () => {
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
