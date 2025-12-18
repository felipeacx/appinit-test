"use client"

import { usePathname } from "next/navigation"

export function SkipLink() {
  const pathname = usePathname()

  if (pathname === "/login") {
    return <div suppressHydrationWarning />
  }

  return (
    <a
      href="#main-content"
      aria-label="Skip to main content"
      className="fixed top-0 left-0 z-50 p-4 text-primary"
      suppressHydrationWarning
    >
      Ir al contenido principal
    </a>
  )
}
