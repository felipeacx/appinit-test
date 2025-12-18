/**
 * Tipos para el sistema de chat de IA
 */

export interface ChatMessage {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
}

export interface ChatErrorResponse {
  error: string
}
