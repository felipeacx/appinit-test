import React from "react"
import { render, screen, act } from "@testing-library/react"
import ThemeToggle from "../../components/ThemeToggle"

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear()
    // Restablecer classList de HTML
    document.documentElement.className = ""
  })

  afterEach(() => {
    localStorage.clear()
  })

  it("debe renderizar después del montaje", async () => {
    render(<ThemeToggle />)

    // Esperar a que el componente se monte
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
  })
})
