import { ChatMessage, ChatRequest, ChatResponse, ChatErrorResponse } from "../../types/chat"

describe("tipos de chat", () => {
  describe("ChatMessage", () => {
    it("debe crear ChatMessage válido desde usuario", () => {
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

    it("debe crear ChatMessage válido desde IA", () => {
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
  })

  describe("ChatRequest", () => {
    it("debe crear ChatRequest válido", () => {
      const request: ChatRequest = {
        message: "What is the balance?",
      }

      expect(request.message).toBe("What is the balance?")
    })
  })

  describe("ChatResponse", () => {
    it("debe crear ChatResponse válido", () => {
      const response: ChatResponse = {
        response: "Your balance is $500",
      }

      expect(response.response).toBe("Your balance is $500")
    })
  })

  describe("ChatErrorResponse", () => {
    it("debe crear ChatErrorResponse válido", () => {
      const error: ChatErrorResponse = {
        error: "Failed to process message",
      }

      expect(error.error).toBe("Failed to process message")
    })
  })
})
