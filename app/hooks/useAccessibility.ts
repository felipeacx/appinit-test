import { useEffect, useRef } from "react"
import { FocusManagement, SkipLinkId } from "@/app/lib/accessibility"

export const useAutoFocus = (shouldFocus = true) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (shouldFocus && ref.current) {
      FocusManagement.setFocusVisible(ref.current)
    }
  }, [shouldFocus])

  return ref
}

export const useFocusTrap = (isActive = true) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !ref.current) return

    const element = ref.current
    const { handleKeyDown } = FocusManagement.trapFocus(element)

    const handler = (e: KeyboardEvent) => {
      handleKeyDown(e)
    }

    element.addEventListener("keydown", handler)

    return () => {
      element.removeEventListener("keydown", handler)
    }
  }, [isActive])

  return ref
}

export const useKeyboard = (
  key: string,
  callback: () => void,
  options: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === key &&
        e.ctrlKey === (options.ctrlKey || false) &&
        e.shiftKey === (options.shiftKey || false) &&
        e.altKey === (options.altKey || false)
      ) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [key, callback, options])
}

export const useModal = (isOpen: boolean) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement

      if (dialogRef.current) {
        dialogRef.current.focus()
      }

      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""

      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return dialogRef
}

export const useSkipLink = () => {
  const handleSkipClick = () => {
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView()
    }
  }

  return { handleSkipClick, skipLinkId: SkipLinkId }
}

export const useAnnounce = () => {
  const announcerRef = useRef<HTMLDivElement>(null)

  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    if (!announcerRef.current) {
      const announcer = document.createElement("div")
      announcer.setAttribute("aria-live", priority)
      announcer.setAttribute("aria-atomic", "true")
      announcer.className = "sr-only"
      document.body.appendChild(announcer)
      announcerRef.current = announcer
    }

    announcerRef.current.setAttribute("aria-live", priority)
    announcerRef.current.textContent = message
  }

  return { announce }
}
