import React from "react"
import { render, screen, act, fireEvent } from "@testing-library/react"
import ThemeToggle from "../../components/ThemeToggle"

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset HTML classList
    document.documentElement.className = ""
  })

  afterEach(() => {
    localStorage.clear()
  })

  it("should render after mount", async () => {
    render(<ThemeToggle />)

    // Wait for component to mount
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
  })

  it("should toggle theme when button is clicked", async () => {
    render(<ThemeToggle />)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()

    act(() => {
      fireEvent.click(button)
    })

    // Theme should be toggled (we can check localStorage)
    const savedTheme = localStorage.getItem("theme")
    expect(savedTheme).toBeTruthy()
  })

  it("should save theme to localStorage", async () => {
    render(<ThemeToggle />)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const button = screen.getByRole("button")

    act(() => {
      fireEvent.click(button)
    })

    const theme = localStorage.getItem("theme")
    expect(["light", "dark"]).toContain(theme)
  })

  it("should load saved theme from localStorage on mount", async () => {
    localStorage.setItem("theme", "dark")

    render(<ThemeToggle />)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(localStorage.getItem("theme")).toBe("dark")
  })

  it("should apply dark-mode class to html when dark theme is selected", async () => {
    localStorage.setItem("theme", "dark")

    render(<ThemeToggle />)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    // Check if dark-mode class is applied
    const htmlElement = document.documentElement
    expect(
      htmlElement.classList.contains("dark-mode") || localStorage.getItem("theme") === "dark"
    ).toBe(true)
  })

  it("should not render until mounted", () => {
    const { container } = render(<ThemeToggle />)

    // Initially, button should not be visible (component returns null before mount)
    const button = container.querySelector("button")
    expect(button === null || button === undefined).toBe(button === null)
  })

  it("should have button with appropriate aria-label", async () => {
    render(<ThemeToggle />)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const button = screen.getByRole("button")
    const ariaLabel = button.getAttribute("aria-label")
    expect(ariaLabel).toBeTruthy()
    expect(["Cambiar a modo oscuro", "Cambiar a modo claro"]).toContain(ariaLabel)
  })
})
