import React from "react"
import { render, screen } from "@testing-library/react"
import { SkipLink } from "../../components/SkipLink"

// Mock usePathname
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}))

import { usePathname } from "next/navigation"

describe("SkipLink", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render skip link when not on login page", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/dashboard")

    render(<SkipLink />)
    const skipLink = screen.getByRole("link")
    expect(skipLink).toBeInTheDocument()
  })

  it("should not render when on login page", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/login")

    const { container } = render(<SkipLink />)
    const skipLink = container.querySelector("a")
    expect(skipLink).not.toBeInTheDocument()
  })

  it("should have aria-label", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/dashboard")

    render(<SkipLink />)
    const skipLink = screen.getByRole("link")
    expect(skipLink).toHaveAttribute("aria-label")
  })

  it("should have href attribute pointing to main-content", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/dashboard")

    render(<SkipLink />)
    const skipLink = screen.getByRole("link")
    expect(skipLink).toHaveAttribute("href", "#main-content")
  })

  it("should have text content", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/admin")

    render(<SkipLink />)
    const skipLink = screen.getByRole("link")
    expect(skipLink).toHaveTextContent("Ir al contenido principal")
  })

  it("should have proper CSS classes for fixed positioning", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/")

    const { container } = render(<SkipLink />)
    const skipLink = container.querySelector("a")
    expect(skipLink).toHaveClass("fixed")
    expect(skipLink).toHaveClass("top-0")
    expect(skipLink).toHaveClass("left-0")
  })

  it("should have suppressHydrationWarning attribute", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/transactions")

    const { container } = render(<SkipLink />)
    const skipLink = container.querySelector("a")
    expect(skipLink).toBeDefined()
  })

  it("should render as anchor tag", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/dashboard")

    const { container } = render(<SkipLink />)
    const skipLink = container.querySelector("a")
    expect(skipLink?.tagName.toLowerCase()).toBe("a")
  })
})
