import { ChatMessage, ChatRequest, ChatResponse, ChatErrorResponse } from "../../types/chat"

describe("chat types", () => {
  describe("ChatMessage", () => {
    it("should create valid ChatMessage from user", () => {
      const message: ChatMessage = {
        id: "msg-1",
        text: "Hello",
        sender: "user",
        timestamp: new Date(),
      }

      expect(message.id).toBe("msg-1")
      expect(message.text).toBe("Hello")
      expect(message.sender).toBe("user")
      expect(message.timestamp instanceof Date).toBe(true)
    })

    it("should create valid ChatMessage from ai", () => {
      const message: ChatMessage = {
        id: "msg-2",
        text: "Hi there!",
        sender: "ai",
        timestamp: new Date(),
      }

      expect(message.id).toBe("msg-2")
      expect(message.text).toBe("Hi there!")
      expect(message.sender).toBe("ai")
    })

    it("should handle empty text", () => {
      const message: ChatMessage = {
        id: "msg-3",
        text: "",
        sender: "user",
        timestamp: new Date(),
      }

      expect(message.text).toBe("")
    })

    it("should handle long text", () => {
      const longText = "a".repeat(1000)
      const message: ChatMessage = {
        id: "msg-4",
        text: longText,
        sender: "ai",
        timestamp: new Date(),
      }

      expect(message.text.length).toBe(1000)
    })
  })

  describe("ChatRequest", () => {
    it("should create valid ChatRequest", () => {
      const request: ChatRequest = {
        message: "What is the balance?",
      }

      expect(request.message).toBe("What is the balance?")
    })

    it("should handle empty message", () => {
      const request: ChatRequest = {
        message: "",
      }

      expect(request.message).toBe("")
    })

    it("should handle special characters", () => {
      const request: ChatRequest = {
        message: "¿Cuál es el saldo? @#$%",
      }

      expect(request.message).toContain("¿")
      expect(request.message).toContain("@#$%")
    })
  })

  describe("ChatResponse", () => {
    it("should create valid ChatResponse", () => {
      const response: ChatResponse = {
        response: "Your balance is $500",
      }

      expect(response.response).toBe("Your balance is $500")
    })

    it("should handle empty response", () => {
      const response: ChatResponse = {
        response: "",
      }

      expect(response.response).toBe("")
    })

    it("should handle long response", () => {
      const longResponse = "This is a very long response ".repeat(50)
      const response: ChatResponse = {
        response: longResponse,
      }

      expect(response.response.length).toBeGreaterThan(1000)
    })
  })

  describe("ChatErrorResponse", () => {
    it("should create valid ChatErrorResponse", () => {
      const error: ChatErrorResponse = {
        error: "Failed to process message",
      }

      expect(error.error).toBe("Failed to process message")
    })

    it("should handle empty error message", () => {
      const error: ChatErrorResponse = {
        error: "",
      }

      expect(error.error).toBe("")
    })

    it("should handle descriptive error messages", () => {
      const error: ChatErrorResponse = {
        error: "API key not configured. Please set NEXT_PUBLIC_API_BASE_URL environment variable.",
      }

      expect(error.error).toContain("API key")
      expect(error.error).toContain("NEXT_PUBLIC_API_BASE_URL")
    })
  })

  describe("Type compatibility", () => {
    it("ChatMessage should have all required properties", () => {
      const message: ChatMessage = {
        id: "test",
        text: "test",
        sender: "user",
        timestamp: new Date(),
      }

      expect(Object.keys(message).length).toBeGreaterThanOrEqual(4)
      expect("id" in message).toBe(true)
      expect("text" in message).toBe(true)
      expect("sender" in message).toBe(true)
      expect("timestamp" in message).toBe(true)
    })

    it("should allow sender as user or ai", () => {
      const userMessage: ChatMessage = {
        id: "1",
        text: "User text",
        sender: "user",
        timestamp: new Date(),
      }

      const aiMessage: ChatMessage = {
        id: "2",
        text: "AI text",
        sender: "ai",
        timestamp: new Date(),
      }

      expect(userMessage.sender).toBe("user")
      expect(aiMessage.sender).toBe("ai")
    })
  })
})
