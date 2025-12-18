"use client"

import { useEffect, useState } from "react"
import { BiSun, BiMoon } from "react-icons/bi"

const getInitialTheme = (): "light" | "dark" | null => {
  if (typeof window === "undefined") return null
  const saved = localStorage.getItem("theme") as "light" | "dark" | null
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  return saved || (prefersDark ? "dark" : "light")
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const applyTheme = (newTheme: "light" | "dark") => {
    const html = document.documentElement

    if (newTheme === "dark") {
      html.classList.add("dark-mode")
    } else {
      html.classList.remove("dark-mode")
    }

    localStorage.setItem("theme", newTheme)
  }

  useEffect(() => {
    const initialTheme = getInitialTheme()
    if (initialTheme) {
      applyTheme(initialTheme)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(initialTheme)
    }
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    applyTheme(newTheme)
    setTheme(newTheme)
  }

  const themeLabel = theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 rounded-full bg-primary text-white hover:opacity-90 transition shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      aria-label={themeLabel}
      title={themeLabel}
      aria-pressed={theme === "dark"}
    >
      <span className="sr-only">{themeLabel}</span>
      {theme === "light" ? (
        <BiMoon className="text-xl" aria-hidden="true" />
      ) : (
        <BiSun className="text-xl" aria-hidden="true" />
      )}
    </button>
  )
}
