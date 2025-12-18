/**
 * Utilidades de Accesibilidad WCAG 2.1
 * Proporciona funciones auxiliares para el desarrollo de componentes accesibles
 */

/**
 * Generar aria-label para iconos con texto descriptivo
 */
export const createAriaLabel = (action: string, context?: string): string => {
  return context ? `${action} - ${context}` : action
}

/**
 * Verificar si el usuario prefiere movimiento reducido
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Generar ID único para elementos de formulario
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Verificar relación de contraste de color
 * @returns verdadero si el contraste es >= 4.5:1 (estándar AA para texto normal)
 */
export const checkContrast = (hexColor1: string, hexColor2: string): boolean => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.replace("#", ""), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance <= 0.5 ? luminance + 0.05 : (luminance + 0.05) / 0.05
  }

  const lum1 = getLuminance(hexColor1)
  const lum2 = getLuminance(hexColor2)
  const contrast = Math.max(lum1, lum2) / Math.min(lum1, lum2)

  return contrast >= 4.5
}

/**
 * Enlace para saltar para navegación del teclado
 */
export const SkipLinkId = "skip-to-main-content"

/**
 * Ayudantes de eventos de teclado
 */
export const KeyboardKeys = {
  ENTER: "Enter",
  ESCAPE: "Escape",
  SPACE: " ",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
}

/**
 * Verificar si la pulsación de tecla es una tecla de activación común
 */
export const isActivationKey = (key: string): boolean => {
  return key === KeyboardKeys.ENTER || key === KeyboardKeys.SPACE
}

/**
 * Utilidades de gestión de enfoque
 */
export const FocusManagement = {
  /**
   * Establecer enfoque en un elemento
   */
  setFocus: (element: HTMLElement | null) => {
    if (element) {
      element.focus()
    }
  },

  /**
   * Establecer enfoque con indicador visual
   */
  setFocusVisible: (element: HTMLElement | null) => {
    if (element) {
      element.focus()
      element.classList.add("focus-visible")
    }
  },

  /**
   * Trap focus within an element (for modals)
   */
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    return {
      handleKeyDown: (e: KeyboardEvent) => {
        if (e.key !== KeyboardKeys.TAB) return

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus()
            e.preventDefault()
          }
        }
      },
    }
  },
}

/**
 * Live region announcements for screen readers
 */
export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  const announcement = document.createElement("div")
  announcement.setAttribute("aria-live", priority)
  announcement.setAttribute("aria-atomic", "true")
  announcement.className = "sr-only"
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Eliminar después del anuncio
  setTimeout(() => {
    announcement.remove()
  }, 1000)
}

/**
 * Crear ayudante de campo de formulario accesible
 */
export interface AccessibleFormFieldConfig {
  id: string
  label: string
  type?: string
  required?: boolean
  description?: string
  error?: string
  disabled?: boolean
}

export const createAccessibleFormField = (config: AccessibleFormFieldConfig) => {
  return {
    inputProps: {
      id: config.id,
      type: config.type || "text",
      "aria-label": config.label,
      "aria-required": config.required,
      "aria-invalid": !!config.error,
      "aria-describedby":
        config.description || config.error ? `${config.id}-description` : undefined,
      disabled: config.disabled,
    },
    labelProps: {
      htmlFor: config.id,
    },
    descriptionId: `${config.id}-description`,
  }
}

/**
 * Crear ayudante de botón accesible
 */
export interface AccessibleButtonConfig {
  label: string
  ariaLabel?: string
  disabled?: boolean
  ariaPressed?: boolean
  ariaExpanded?: boolean
}

export const createAccessibleButton = (config: AccessibleButtonConfig) => {
  return {
    "aria-label": config.ariaLabel || config.label,
    "aria-pressed": config.ariaPressed,
    "aria-expanded": config.ariaExpanded,
    disabled: config.disabled,
  }
}

/**
 * Color contrast utilities for theme
 */
export const ContrastLevels = {
  AA: 4.5, // Normal text
  AALarge: 3, // Large text (18pt+)
  AAA: 7, // Enhanced contrast for normal text
  AAALarge: 4.5, // Enhanced contrast for large text
}

/**
 * Semantic HTML heading hierarchy validator
 */
export const validateHeadingHierarchy = (): { valid: boolean; errors: string[] } => {
  if (typeof document === "undefined") {
    return { valid: true, errors: [] }
  }

  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
  const errors: string[] = []
  let lastLevel = 0

  for (const heading of headings) {
    const level = parseInt(heading.tagName[1])

    if (lastLevel > 0 && level - lastLevel > 1) {
      errors.push(`Heading hierarchy skip: H${lastLevel} → H${level}`)
    }

    lastLevel = level
  }

  return { valid: errors.length === 0, errors }
}
