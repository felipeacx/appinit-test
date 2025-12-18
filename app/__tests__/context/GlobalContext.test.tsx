import React from "react"
import { render, screen, waitFor, act } from "@testing-library/react"
import { GlobalProvider, useGlobalContext } from "../../context/GlobalContext"

// Mock component that uses the context
function TestComponent() {
  const context = useGlobalContext()
  return (
    <div>
      <div data-testid="auth-status">
        {context?.isAuthenticated ? "Authenticated" : "Not authenticated"}
      </div>
      <div data-testid="user-email">{context?.user?.email || "No user"}</div>
      <div data-testid="transactions-count">{context?.transactions?.length || 0}</div>
      <button onClick={() => context?.logout()}>Logout</button>
    </div>
  )
}

describe("GlobalContext", () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe("GlobalProvider", () => {
    it("should render children", () => {
      render(
        <GlobalProvider>
          <div data-testid="child">Test Child</div>
        </GlobalProvider>
      )
      expect(screen.getByTestId("child")).toBeInTheDocument()
    })

    it("should provide initial context", () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Not authenticated")
    })

    it("should load user from localStorage on mount", async () => {
      const testUser = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
        role: "user" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem("user", JSON.stringify(testUser))

      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com")
      })
    })

    it("should handle invalid localStorage data gracefully", () => {
      localStorage.setItem("user", "invalid json")

      expect(() => {
        render(
          <GlobalProvider>
            <TestComponent />
          </GlobalProvider>
        )
      }).not.toThrow()
    })
  })

  describe("useGlobalContext", () => {
    it("should throw error when used outside provider", () => {
      // Suppress console.error for this test
      const spy = jest.spyOn(console, "error").mockImplementation(() => {})

      function InvalidComponent() {
        useGlobalContext()
        return <div>Test</div>
      }

      expect(() => {
        render(<InvalidComponent />)
      }).toThrow()

      spy.mockRestore()
    })

    it("should return context when used inside provider", () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(screen.getByTestId("auth-status")).toBeInTheDocument()
      expect(screen.getByTestId("user-email")).toBeInTheDocument()
    })
  })

  describe("GlobalContext methods", () => {
    it("should have logout function", () => {
      const testUser = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
        role: "user" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem("user", JSON.stringify(testUser))

      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(() => {
        const logoutButton = screen.getByText("Logout")
        act(() => {
          logoutButton.click()
        })
      }).not.toThrow()
    })

    it("should initialize with empty transactions", () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(screen.getByTestId("transactions-count")).toHaveTextContent("0")
    })

    it("should have loading state initially", async () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      // Component should render even during loading
      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toBeInTheDocument()
      })
    })
  })

  describe("Authentication flow", () => {
    it("should handle missing localStorage user", async () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent("Not authenticated")
      })
    })

    it("should maintain state after mount", async () => {
      const testUser = {
        id: "456",
        email: "user@test.com",
        name: "User Test",
        role: "admin" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem("user", JSON.stringify(testUser))

      const { rerender } = render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent("user@test.com")
      })

      // Rerender should maintain state
      rerender(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(screen.getByTestId("user-email")).toHaveTextContent("user@test.com")
    })
  })

  describe("Data structures", () => {
    it("should initialize empty arrays for transactions", () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(screen.getByTestId("transactions-count")).toHaveTextContent("0")
    })

    it("should initialize user as null", () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(screen.getByTestId("user-email")).toHaveTextContent("No user")
    })
  })
})
