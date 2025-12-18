import React from "react"
import { render, screen } from "@testing-library/react"
import { ToastContainer } from "../../components/ToastContainer"

// Simular el hook useNotifications
jest.mock("../../context/NotificationContext", () => ({
  useNotifications: jest.fn(),
}))

import { useNotifications } from "../../context/NotificationContext"

describe("ToastContainer", () => {
  const mockRemoveNotification = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("debe renderizar div contenedor", () => {
    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications: [],
      removeNotification: mockRemoveNotification,
    })

    const { container } = render(<ToastContainer />)
    expect(container.querySelector(".fixed.bottom-4.right-4")).toBeInTheDocument()
  })

  it("debe renderizar sin toasts cuando array de notificaciones está vacío", () => {
    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications: [],
      removeNotification: mockRemoveNotification,
    })

    const { container } = render(<ToastContainer />)
    const toasts = container.querySelectorAll("[class*='border-']")
    expect(toasts.length).toBe(0)
  })

  it("debe renderizar toast para cada notificación", () => {
    const notifications = [
      {
        id: "1",
        type: "success" as const,
        title: "Success",
        message: "Operation successful",
      },
      {
        id: "2",
        type: "error" as const,
        title: "Error",
        message: "Something went wrong",
      },
    ]

    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications,
      removeNotification: mockRemoveNotification,
    })

    render(<ToastContainer />)

    expect(screen.getByText("Success")).toBeInTheDocument()
    expect(screen.getByText("Operation successful")).toBeInTheDocument()
    expect(screen.getByText("Error")).toBeInTheDocument()
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })

  it("debe renderizar toast con título y mensaje", () => {
    const notifications = [
      {
        id: "1",
        type: "info" as const,
        title: "Information",
        message: "This is an information message",
      },
    ]

    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications,
      removeNotification: mockRemoveNotification,
    })

    render(<ToastContainer />)

    expect(screen.getByText("Information")).toBeInTheDocument()
    expect(screen.getByText("This is an information message")).toBeInTheDocument()
  })

  it("debe renderizar notificación de advertencia", () => {
    const notifications = [
      {
        id: "1",
        type: "warning" as const,
        title: "Warning",
        message: "Be careful",
      },
    ]

    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications,
      removeNotification: mockRemoveNotification,
    })

    render(<ToastContainer />)

    expect(screen.getByText("Warning")).toBeInTheDocument()
    expect(screen.getByText("Be careful")).toBeInTheDocument()
  })

  it("debe manejar notificación con acción", () => {
    const mockAction = jest.fn()
    const notifications = [
      {
        id: "1",
        type: "success" as const,
        title: "Success",
        message: "Item created",
        action: {
          label: "View",
          onClick: mockAction,
        },
      },
    ]

    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications,
      removeNotification: mockRemoveNotification,
    })

    render(<ToastContainer />)

    const actionButton = screen.getByText("View")
    expect(actionButton).toBeInTheDocument()
  })

  it("debe tener posicionamiento z-index adecuado", () => {
    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications: [],
      removeNotification: mockRemoveNotification,
    })

    const { container } = render(<ToastContainer />)
    const toastContainer = container.querySelector(".fixed")
    expect(toastContainer).toHaveClass("z-9999")
  })

  it("debe tener space-y-3 para espaciado entre toasts", () => {
    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications: [],
      removeNotification: mockRemoveNotification,
    })

    const { container } = render(<ToastContainer />)
    const toastContainer = container.querySelector(".fixed")
    expect(toastContainer).toHaveClass("space-y-3")
  })
})
