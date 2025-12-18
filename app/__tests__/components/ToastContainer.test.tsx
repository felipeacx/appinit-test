import React from "react"
import { render, screen } from "@testing-library/react"
import { ToastContainer } from "../../components/ToastContainer"

// Mock the useNotifications hook
jest.mock("../../context/NotificationContext", () => ({
  useNotifications: jest.fn(),
}))

import { useNotifications } from "../../context/NotificationContext"

describe("ToastContainer", () => {
  const mockRemoveNotification = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render container div", () => {
    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications: [],
      removeNotification: mockRemoveNotification,
    })

    const { container } = render(<ToastContainer />)
    expect(container.querySelector(".fixed.bottom-4.right-4")).toBeInTheDocument()
  })

  it("should render no toasts when notifications array is empty", () => {
    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications: [],
      removeNotification: mockRemoveNotification,
    })

    const { container } = render(<ToastContainer />)
    const toasts = container.querySelectorAll("[class*='border-']")
    expect(toasts.length).toBe(0)
  })

  it("should render toast for each notification", () => {
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

  it("should render toast with title and message", () => {
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

  it("should render warning notification", () => {
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

  it("should handle notification with action", () => {
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

  it("should have proper z-index positioning", () => {
    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications: [],
      removeNotification: mockRemoveNotification,
    })

    const { container } = render(<ToastContainer />)
    const toastContainer = container.querySelector(".fixed")
    expect(toastContainer).toHaveClass("z-9999")
  })

  it("should have space-y-3 for spacing between toasts", () => {
    ;(useNotifications as jest.Mock).mockReturnValue({
      notifications: [],
      removeNotification: mockRemoveNotification,
    })

    const { container } = render(<ToastContainer />)
    const toastContainer = container.querySelector(".fixed")
    expect(toastContainer).toHaveClass("space-y-3")
  })
})
