import {
  SYSTEM_PROMPTS,
  CHAT_THEMES,
  CHAT_POSITIONS,
  MAX_MESSAGES_HISTORY,
  API_REQUEST_TIMEOUT,
  DEFAULT_MESSAGES,
  truncateMessage,
} from "../../lib/chatUtils"

describe("utilidades de chat", () => {
  describe("SYSTEM_PROMPTS", () => {
    it("debe tener indicación financiera", () => {
      expect(SYSTEM_PROMPTS.financial).toContain("asistente de IA")
      expect(SYSTEM_PROMPTS.financial).toContain("finanzas")
    })

    it("debe tener indicación general", () => {
      expect(SYSTEM_PROMPTS.general).toContain("asistente de IA")
      expect(SYSTEM_PROMPTS.general).toContain("español")
    })
  })

  describe("CHAT_THEMES", () => {
    it("debe tener múltiples opciones de tema", () => {
      expect(CHAT_THEMES).toHaveProperty("blue")
      expect(CHAT_THEMES).toHaveProperty("purple")
      expect(CHAT_THEMES).toHaveProperty("green")
      expect(CHAT_THEMES).toHaveProperty("indigo")
    })
  })

  describe("CHAT_POSITIONS", () => {
    it("debe tener opciones de posición válidas", () => {
      expect(CHAT_POSITIONS).toHaveProperty("bottom-right")
      expect(CHAT_POSITIONS).toHaveProperty("bottom-left")
      expect(CHAT_POSITIONS).toHaveProperty("top-right")
      expect(CHAT_POSITIONS).toHaveProperty("top-left")
    })
  })

  describe("Constantes", () => {
    it("debe tener MAX_MESSAGES_HISTORY válido", () => {
      expect(MAX_MESSAGES_HISTORY).toBe(50)
      expect(typeof MAX_MESSAGES_HISTORY).toBe("number")
    })

    it("debe tener API_REQUEST_TIMEOUT válido", () => {
      expect(API_REQUEST_TIMEOUT).toBe(30000)
      expect(typeof API_REQUEST_TIMEOUT).toBe("number")
    })
  })

  describe("DEFAULT_MESSAGES", () => {
    it("debe tener mensaje de bienvenida", () => {
      expect(DEFAULT_MESSAGES.welcome).toBeTruthy()
      expect(DEFAULT_MESSAGES.welcome).toContain("asistente")
    })

    it("debe tener mensaje de error", () => {
      expect(DEFAULT_MESSAGES.error).toBeTruthy()
      expect(DEFAULT_MESSAGES.error).toContain("error")
    })
  })

  describe("truncateMessage", () => {
    it("debe devolver mensaje tal cual si está por debajo de longitud máxima", () => {
      const message = "Short message"
      const result = truncateMessage(message, 500)
      expect(result).toBe(message)
    })

    it("debe truncar mensaje si excede longitud máxima", () => {
      const message = "a".repeat(600)
      const result = truncateMessage(message, 500)
      expect(result).toBe("a".repeat(500) + "...")
      expect(result.length).toBe(503)
    })
  })
})
