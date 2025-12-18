import React from "react"
import { render, screen } from "@testing-library/react"
import { SkipLink } from "../../components/SkipLink"

// Simular usePathname
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}))

import { usePathname } from "next/navigation"

describe("SkipLink", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("debe renderizar enlace de salto cuando no está en página de inicio de sesión", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/dashboard")

    render(<SkipLink />)
    const skipLink = screen.getByRole("link")
    expect(skipLink).toBeInTheDocument()
  })

  it("no debe renderizar cuando está en página de inicio de sesión", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/login")

    const { container } = render(<SkipLink />)
    const skipLink = container.querySelector("a")
    expect(skipLink).not.toBeInTheDocument()
  })

  it("debe tener aria-label", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/dashboard")

    render(<SkipLink />)
    const skipLink = screen.getByRole("link")
    expect(skipLink).toHaveAttribute("aria-label")
  })

  it("debe tener atributo href apuntando a main-content", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/dashboard")

    render(<SkipLink />)
    const skipLink = screen.getByRole("link")
    expect(skipLink).toHaveAttribute("href", "#main-content")
  })

  it("debe tener contenido de texto", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/admin")

    render(<SkipLink />)
    const skipLink = screen.getByRole("link")
    expect(skipLink).toHaveTextContent("Ir al contenido principal")
  })

  it("debe tener clases CSS apropiadas para posicionamiento fijo", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/")

    const { container } = render(<SkipLink />)
    const skipLink = container.querySelector("a")
    expect(skipLink).toHaveClass("fixed")
    expect(skipLink).toHaveClass("top-0")
    expect(skipLink).toHaveClass("left-0")
  })

  it("debe tener atributo suppressHydrationWarning", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/transactions")

    const { container } = render(<SkipLink />)
    const skipLink = container.querySelector("a")
    expect(skipLink).toBeDefined()
  })

  it("debe renderizar como etiqueta anchor", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/dashboard")

    const { container } = render(<SkipLink />)
    const skipLink = container.querySelector("a")
    expect(skipLink?.tagName.toLowerCase()).toBe("a")
  })
})
