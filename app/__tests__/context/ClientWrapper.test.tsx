import React from "react"
import { render, screen } from "@testing-library/react"
import { ClientWrapper } from "../../context/ClientWrapper"

// Mock ToastContainer to avoid complexity
jest.mock("../../components/ToastContainer", () => ({
  ToastContainer: () => <div data-testid="toast-container">Toast Container</div>,
}))

describe("ClientWrapper", () => {
  it("should render children", () => {
    render(
      <ClientWrapper>
        <div data-testid="test-child">Test Content</div>
      </ClientWrapper>
    )

    expect(screen.getByTestId("test-child")).toBeInTheDocument()
    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("should render main element with id main-content", () => {
    const { container } = render(
      <ClientWrapper>
        <div>Content</div>
      </ClientWrapper>
    )

    const mainElement = container.querySelector("main#main-content")
    expect(mainElement).toBeInTheDocument()
  })

  it("should render ToastContainer", () => {
    render(
      <ClientWrapper>
        <div>Content</div>
      </ClientWrapper>
    )

    expect(screen.getByTestId("toast-container")).toBeInTheDocument()
  })

  it("should provide GlobalProvider and NotificationProvider", () => {
    const { container } = render(
      <ClientWrapper>
        <div>Content</div>
      </ClientWrapper>
    )

    // If the providers are working, the child should render
    expect(container.querySelector("main")).toBeInTheDocument()
  })

  it("should handle multiple children", () => {
    render(
      <ClientWrapper>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </ClientWrapper>
    )

    expect(screen.getByTestId("child-1")).toBeInTheDocument()
    expect(screen.getByTestId("child-2")).toBeInTheDocument()
  })

  it("should wrap children in providers", () => {
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
