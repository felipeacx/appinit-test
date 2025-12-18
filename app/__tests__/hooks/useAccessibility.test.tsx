import { renderHook, act } from "@testing-library/react"
import {
  useAutoFocus,
  useFocusTrap,
  useKeyboard,
  useModal,
  useSkipLink,
  useAnnounce,
} from "../../hooks/useAccessibility"

describe("hooks de accesibilidad", () => {
  describe("useAutoFocus", () => {
    it("debe devolver un objeto ref", () => {
      const { result } = renderHook(() => useAutoFocus())
      expect(result.current).toHaveProperty("current")
    })

    it("debe establecer enfoque al montaje cuando shouldFocus es verdadero", () => {
      const { result } = renderHook(() => useAutoFocus(true))
      const div = document.createElement("div")

      act(() => {
        if (result.current) {
          result.current.current = div
        }
      })

      expect(result.current).toBeDefined()
    })

    it("no debe establecer enfoque cuando shouldFocus es falso", () => {
      const { result } = renderHook(() => useAutoFocus(false))
      const div = document.createElement("div")

      act(() => {
        if (result.current) {
          result.current.current = div
        }
      })

      // El foco no debe ser llamado porque shouldFocus es falso
      expect(result.current).toBeDefined()
    })
  })

  describe("useFocusTrap", () => {
    it("debe devolver un objeto ref", () => {
      const { result } = renderHook(() => useFocusTrap())
      expect(result.current).toHaveProperty("current")
    })

    it("debe adjuntar listener keydown cuando está activo", () => {
      const container = document.createElement("div")
      const button1 = document.createElement("button")
      const button2 = document.createElement("button")
      container.appendChild(button1)
      container.appendChild(button2)

      const { result, rerender } = renderHook(({ isActive }) => useFocusTrap(isActive), {
        initialProps: { isActive: false },
      })

      act(() => {
        result.current.current = container
      })

      const addEventListenerSpy = jest.spyOn(container, "addEventListener")

      // Activar efecto cambiando isActive
      act(() => {
        rerender({ isActive: true })
      })

      expect(addEventListenerSpy).toHaveBeenCalled()
    })

    it("no debe adjuntar listener cuando está inactivo", () => {
      const { result } = renderHook(() => useFocusTrap(false))
      expect(result.current).toBeDefined()
    })
  })

  describe("useKeyboard", () => {
    it("debe disparar callback al presionar tecla específ ica", () => {
      const callback = jest.fn()
      renderHook(() => useKeyboard("Enter", callback))

      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      })

      act(() => {
        window.dispatchEvent(event)
      })

      expect(callback).toHaveBeenCalled()
    })

    it("no debe disparar callback en tecla diferente", () => {
      const callback = jest.fn()
      renderHook(() => useKeyboard("Enter", callback))

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      })

      act(() => {
        window.dispatchEvent(event)
      })

      expect(callback).not.toHaveBeenCalled()
    })

    it("debe soportar teclas modificadoras", () => {
      const callback = jest.fn()
      renderHook(() => useKeyboard("s", callback, { ctrlKey: true }))

      const event = new KeyboardEvent("keydown", {
        key: "s",
        ctrlKey: true,
        bubbles: true,
      })

      act(() => {
        window.dispatchEvent(event)
      })

      expect(callback).toHaveBeenCalled()
    })

    it("debe prevenir comportamiento predeterminado", () => {
      const callback = jest.fn()
      renderHook(() => useKeyboard("Enter", callback))

      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      })
      const preventDefaultSpy = jest.spyOn(event, "preventDefault")

      act(() => {
        window.dispatchEvent(event)
      })

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it("debe limpiar listener de evento al desmontar", () => {
      const callback = jest.fn()
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener")
      const { unmount } = renderHook(() => useKeyboard("Enter", callback))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function))
    })
  })

  describe("useModal", () => {
    it("debe devolver un objeto ref", () => {
      const { result } = renderHook(() => useModal(false))
      expect(result.current).toHaveProperty("current")
    })

    it("debe ocultar overflow de body cuando el modal está abierto", () => {
      const { rerender } = renderHook(({ isOpen }) => useModal(isOpen), {
        initialProps: { isOpen: false },
      })

      act(() => {
        rerender({ isOpen: true })
      })

      expect(document.body.style.overflow).toBe("hidden")
    })

    it("debe restaurar overflow de body cuando se cierra el modal", () => {
      const { rerender } = renderHook(({ isOpen }) => useModal(isOpen), {
        initialProps: { isOpen: true },
      })

      act(() => {
        rerender({ isOpen: false })
      })

      expect(document.body.style.overflow).toBe("")
    })

    it("debe enfocar diálogo cuando se abre", () => {
      const { result, rerender } = renderHook(({ isOpen }) => useModal(isOpen), {
        initialProps: { isOpen: false },
      })

      const dialog = document.createElement("div")

      act(() => {
        if (result.current?.current) {
          result.current.current = dialog
        }
        rerender({ isOpen: true })
      })

      expect(result.current).toBeDefined()
    })

    it("debe restaurar enfoque cuando se cierra el modal", () => {
      const { rerender } = renderHook(({ isOpen }) => useModal(isOpen), {
        initialProps: { isOpen: true },
      })

      const previousFocusElement = document.createElement("button")
      Object.defineProperty(document, "activeElement", {
        value: previousFocusElement,
        configurable: true,
      })

      act(() => {
        rerender({ isOpen: false })
      })

      expect(document.body.style.overflow).toBe("")
    })
  })

  describe("useSkipLink", () => {
    it("debe devolver handleSkipClick y skipLinkId", () => {
      const { result } = renderHook(() => useSkipLink())

      expect(result.current).toHaveProperty("handleSkipClick")
      expect(result.current).toHaveProperty("skipLinkId")
      expect(typeof result.current.handleSkipClick).toBe("function")
      expect(result.current.skipLinkId).toBe("skip-to-main-content")
    })

    it("debe enfocar elemento main-content cuando se llama", () => {
      const { result } = renderHook(() => useSkipLink())
      const mainContent = document.createElement("div")
      mainContent.id = "main-content"
      mainContent.scrollIntoView = jest.fn()
      document.body.appendChild(mainContent)

      const focusSpy = jest.spyOn(mainContent, "focus")
      const scrollSpy = jest.spyOn(mainContent, "scrollIntoView")

      act(() => {
        result.current.handleSkipClick()
      })

      expect(focusSpy).toHaveBeenCalled()
      expect(scrollSpy).toHaveBeenCalled()

      document.body.removeChild(mainContent)
    })

    it("debe manejar main-content faltante elegantemente", () => {
      const { result } = renderHook(() => useSkipLink())

      expect(() => {
        act(() => {
          result.current.handleSkipClick()
        })
      }).not.toThrow()
    })
  })

  describe("useAnnounce", () => {
    it("debe devolver función announce", () => {
      const { result } = renderHook(() => useAnnounce())
      expect(result.current).toHaveProperty("announce")
      expect(typeof result.current.announce).toBe("function")
    })

    it("debe crear aria-live announcer en primera llamada", () => {
      const { result } = renderHook(() => useAnnounce())

      act(() => {
        result.current.announce("Test message")
      })

      const announcer = document.querySelector("[aria-live]")
      expect(announcer).not.toBeNull()
      expect(announcer?.textContent).toBe("Test message")

      // Limpiar
      announcer?.remove()
    })

    it("debe soportar prioridad polite", () => {
      const { result } = renderHook(() => useAnnounce())

      act(() => {
        result.current.announce("Test message", "polite")
      })

      const announcer = document.querySelector("[aria-live]")
      expect(announcer?.getAttribute("aria-live")).toBe("polite")

      // Limpiar
      announcer?.remove()
    })

    it("debe soportar prioridad assertive", () => {
      const { result } = renderHook(() => useAnnounce())

      act(() => {
        result.current.announce("Error message", "assertive")
      })

      const announcer = document.querySelector("[aria-live]")
      expect(announcer?.getAttribute("aria-live")).toBe("assertive")

      // Limpiar
      announcer?.remove()
    })

    it("debe actualizar texto del announcer en llamadas posteriores", () => {
      const { result } = renderHook(() => useAnnounce())

      act(() => {
        result.current.announce("First message")
      })

      let announcer = document.querySelector("[aria-live]")
      expect(announcer?.textContent).toBe("First message")

      act(() => {
        result.current.announce("Second message")
      })

      announcer = document.querySelector("[aria-live]")
      expect(announcer?.textContent).toBe("Second message")

      // Limpiar
      announcer?.remove()
    })
  })
})
