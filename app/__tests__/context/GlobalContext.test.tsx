import React from "react"
import { render, screen, waitFor, act } from "@testing-library/react"
import { GlobalProvider, useGlobalContext } from "../../context/GlobalContext"

// Componente simulado que usa el contexto
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
    global.fetch = jest.fn()
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
  })

  describe("GlobalProvider", () => {
    it("debe renderizar children", () => {
      render(
        <GlobalProvider>
          <div data-testid="child">Test Child</div>
        </GlobalProvider>
      )
      expect(screen.getByTestId("child")).toBeInTheDocument()
    })

    it("debe proporcionar contexto inicial", () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Not authenticated")
    })

    it("debe cargar usuario de localStorage al montaje", async () => {
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

    it("debe manejar datos inválidos de localStorage elegantemente", () => {
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
    it("debe lanzar error cuando se usa fuera del proveedor", () => {
      // Suprimir console.error para esta prueba
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

    it("debe devolver contexto cuando se usa dentro del proveedor", () => {
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
    it("debe tener función logout", () => {
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

    it("debe inicializar con transacciones vacías", () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(screen.getByTestId("transactions-count")).toHaveTextContent("0")
    })

    it("debe tener estado de carga inicialmente", async () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      // Componente debe renderizarse incluso durante la carga
      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toBeInTheDocument()
      })
    })
  })

  describe("Flujo de autenticación", () => {
    it("debe manejar usuario localStorage faltante", async () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent("Not authenticated")
      })
    })

    it("debe mantener estado después del montaje", async () => {
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

      // Redibujar debe mantener el estado
      rerender(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(screen.getByTestId("user-email")).toHaveTextContent("user@test.com")
    })
  })

  describe("Estructuras de datos", () => {
    it("debe inicializar arrays vacíos para transacciones", () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(screen.getByTestId("transactions-count")).toHaveTextContent("0")
    })

    it("debe inicializar usuario como nulo", () => {
      render(
        <GlobalProvider>
          <TestComponent />
        </GlobalProvider>
      )

      expect(screen.getByTestId("user-email")).toHaveTextContent("No user")
    })
  })
})
