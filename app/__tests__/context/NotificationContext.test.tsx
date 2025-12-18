import React from "react"
import { render, screen, act } from "@testing-library/react"
import { NotificationProvider, useNotifications } from "../../context/NotificationContext"
import { NOTIFICATION_DURATIONS } from "../../types/notifications"

// Componente simulado que usa notificaciones
function TestComponent() {
  const { notifications, success, error, info, warning, removeNotification, clearNotifications } =
    useNotifications()

  return (
    <div>
      <div data-testid="notification-count">{notifications.length}</div>
      <button onClick={() => success("Success", "Operation successful")}>Show Success</button>
      <button onClick={() => error("Error", "An error occurred")}>Show Error</button>
      <button onClick={() => info("Info", "Information message")}>Show Info</button>
      <button onClick={() => warning("Warning", "Warning message")}>Show Warning</button>
      <button onClick={() => clearNotifications()}>Clear All</button>
      {notifications.map((notif) => (
        <div key={notif.id} data-testid={`notification-${notif.id}`}>
          <div className="type">{notif.type}</div>
          <div className="title">{notif.title}</div>
          <div className="message">{notif.message}</div>
          <button onClick={() => removeNotification(notif.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}

describe("NotificationContext", () => {
  describe("NotificationProvider", () => {
    it("debe renderizar children", () => {
      render(
        <NotificationProvider>
          <div data-testid="child">Test Child</div>
        </NotificationProvider>
      )
      expect(screen.getByTestId("child")).toBeInTheDocument()
    })

    it("debe proporcionar notificaciones iniciales vacías", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      )
      expect(screen.getByTestId("notification-count")).toHaveTextContent("0")
    })
  })

  describe("useNotifications", () => {
    it("debe lanzar error cuando se usa fuera del proveedor", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {})

      function InvalidComponent() {
        useNotifications()
        return <div>Test</div>
      }

      expect(() => {
        render(<InvalidComponent />)
      }).toThrow("useNotifications must be used within NotificationProvider")

      spy.mockRestore()
    })

    it("debe devolver contexto de notificaciones cuando se usa dentro del proveedor", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      )

      expect(screen.getByTestId("notification-count")).toBeInTheDocument()
    })
  })

  describe("addNotification", () => {
    it("debe añadir notificación a la lista", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      )

      const successButton = screen.getByText("Show Success")
      act(() => {
        successButton.click()
      })

      expect(screen.getByTestId("notification-count")).toHaveTextContent("1")
    })

    it("debe devolver id de notificación", () => {
      let notificationId: string | null = null

      function TestComponentWithId() {
        const { addNotification } = useNotifications()

        return (
          <button
            onClick={() => {
              notificationId = addNotification({
                type: "success",
                title: "Test",
                message: "Test message",
              })
            }}
          >
            Add Notification
          </button>
        )
      }

      render(
        <NotificationProvider>
          <TestComponentWithId />
        </NotificationProvider>
      )

      const button = screen.getByText("Add Notification")
      act(() => {
        button.click()
      })

      expect(notificationId).toBeTruthy()
      expect(typeof notificationId).toBe("string")
    })

    it("debe establecer duración a la predeterminada si no se proporciona", () => {
      function TestComponentWithDuration() {
        const { notifications, addNotification } = useNotifications()

        return (
          <>
            <button
              onClick={() => {
                addNotification({
                  type: "success",
                  title: "Test",
                  message: "Test message",
                })
              }}
            >
              Add
            </button>
            <div data-testid="notification-duration">{notifications[0]?.duration || ""}</div>
          </>
        )
      }

      render(
        <NotificationProvider>
          <TestComponentWithDuration />
        </NotificationProvider>
      )

      const button = screen.getByText("Add")
      act(() => {
        button.click()
      })

      expect(screen.getByTestId("notification-duration")).toHaveTextContent(
        String(NOTIFICATION_DURATIONS.MEDIUM)
      )
    })
  })

  describe("removeNotification", () => {
    it("debe eliminar notificación por id", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      )

      const successButton = screen.getByText("Show Success")
      act(() => {
        successButton.click()
      })

      expect(screen.getByTestId("notification-count")).toHaveTextContent("1")

      const removeButton = screen.getByText("Remove")
      act(() => {
        removeButton.click()
      })

      expect(screen.getByTestId("notification-count")).toHaveTextContent("0")
    })
  })

  describe("clearNotifications", () => {
    it("debe eliminar todas las notificaciones", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      )

      const successButton = screen.getByText("Show Success")
      const errorButton = screen.getByText("Show Error")

      act(() => {
        successButton.click()
        errorButton.click()
      })

      expect(screen.getByTestId("notification-count")).toHaveTextContent("2")

      const clearButton = screen.getByText("Clear All")
      act(() => {
        clearButton.click()
      })

      expect(screen.getByTestId("notification-count")).toHaveTextContent("0")
    })
  })

  describe("Funciones auxiliares", () => {
    it("debe crear notificación de éxito", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      )

      const successButton = screen.getByText("Show Success")
      act(() => {
        successButton.click()
      })

      const notification = screen.getByText("Operation successful").parentElement?.parentElement
      expect(notification?.querySelector(".type")).toHaveTextContent("success")
      expect(notification?.querySelector(".title")).toHaveTextContent("Success")
    })

    it("debe crear notificación de error", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      )

      const errorButton = screen.getByText("Show Error")
      act(() => {
        errorButton.click()
      })

      const notification = screen.getByText("An error occurred").parentElement?.parentElement
      expect(notification?.querySelector(".type")).toHaveTextContent("error")
      expect(notification?.querySelector(".title")).toHaveTextContent("Error")
    })

    it("debe crear notificación de información", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      )

      const infoButton = screen.getByText("Show Info")
      act(() => {
        infoButton.click()
      })

      const notification = screen.getByText("Information message").parentElement?.parentElement
      expect(notification?.querySelector(".type")).toHaveTextContent("info")
      expect(notification?.querySelector(".title")).toHaveTextContent("Info")
    })

    it("debe crear notificación de advertencia", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      )

      const warningButton = screen.getByText("Show Warning")
      act(() => {
        warningButton.click()
      })

      const notification = screen.getByText("Warning message").parentElement?.parentElement
      expect(notification?.querySelector(".type")).toHaveTextContent("warning")
      expect(notification?.querySelector(".title")).toHaveTextContent("Warning")
    })
  })

  describe("Propiedades de notificación", () => {
    it("debe incluir timestamp en notificación", () => {
      function TestComponentTimestamp() {
        const { notifications, addNotification } = useNotifications()

        return (
          <>
            <button
              onClick={() => {
                addNotification({
                  type: "info",
                  title: "Test",
                  message: "Test message",
                })
              }}
            >
              Add
            </button>
            <div data-testid="has-timestamp">{notifications[0]?.timestamp ? "yes" : "no"}</div>
          </>
        )
      }

      render(
        <NotificationProvider>
          <TestComponentTimestamp />
        </NotificationProvider>
      )

      const button = screen.getByText("Add")
      act(() => {
        button.click()
      })

      expect(screen.getByTestId("has-timestamp")).toHaveTextContent("yes")
    })
  })
})
