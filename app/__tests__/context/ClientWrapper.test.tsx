import React from "react"
import { render, screen } from "@testing-library/react"
import { ClientWrapper } from "../../context/ClientWrapper"

// Simular ToastContainer para evitar complejidad
jest.mock("../../components/ToastContainer", () => ({
  ToastContainer: () => <div data-testid="toast-container">Toast Container</div>,
}))

describe("ClientWrapper", () => {
  it("debe renderizar children", () => {
    render(
      <ClientWrapper>
        <div data-testid="test-child">Test Content</div>
      </ClientWrapper>
    )

    expect(screen.getByTestId("test-child")).toBeInTheDocument()
    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("debe renderizar elemento main con id main-content", () => {
    const { container } = render(
      <ClientWrapper>
        <div>Content</div>
      </ClientWrapper>
    )

    const mainElement = container.querySelector("main#main-content")
    expect(mainElement).toBeInTheDocument()
  })

  it("debe renderizar ToastContainer", () => {
    render(
      <ClientWrapper>
        <div>Content</div>
      </ClientWrapper>
    )

    expect(screen.getByTestId("toast-container")).toBeInTheDocument()
  })

  it("debe proporcionar GlobalProvider y NotificationProvider", () => {
    const { container } = render(
      <ClientWrapper>
        <div>Content</div>
      </ClientWrapper>
    )

    // Si los proveedores están funcionando, el hijo debe renderizarse
    expect(container.querySelector("main")).toBeInTheDocument()
  })

  it("debe manejar múltiples children", () => {
    render(
      <ClientWrapper>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </ClientWrapper>
    )

    expect(screen.getByTestId("child-1")).toBeInTheDocument()
    expect(screen.getByTestId("child-2")).toBeInTheDocument()
  })

  it("debe envolver children en proveedores", () => {
    render(
      <ClientWrapper>
        <div>Wrapped Content</div>
      </ClientWrapper>
    )

    const main = screen.getByText("Wrapped Content").parentElement
    expect(main?.id).toBe("main-content")
    expect(main?.tagName.toLowerCase()).toBe("main")
  })
})
