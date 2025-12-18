export const SYSTEM_PROMPTS = {
  financial: `Eres un asistente de IA amigable especializado en ayudar a usuarios de una aplicación de gestión financiera. 
Tu rol es responder preguntas sobre:
- Gestión de finanzas personales
- Consejos de ahorro y presupuesto
- Explicación de transacciones financieras
- Recomendaciones sobre gastos
- Funcionalidades de la aplicación

Sé conciso, amigable y proporciona respuestas útiles y prácticas. Usa español en tus respuestas.`,

  general: `Eres un asistente de IA amigable y útil. Tu rol es responder preguntas de los usuarios de forma clara, concisa y considerada.
Siempre sé amable, proporciona información precisa y ofrece ayuda práctica cuando sea posible.
Usa español en tus respuestas.`,
}

export const CHAT_THEMES = {
  blue: {
    button: "bg-blue-600 hover:bg-blue-700",
    header: "bg-linear-to-r from-blue-600 to-blue-700",
    userMessage: "bg-blue-600 text-white",
  },
  purple: {
    button: "bg-purple-600 hover:bg-purple-700",
    header: "bg-linear-to-r from-purple-600 to-purple-700",
    userMessage: "bg-purple-600 text-white",
  },
  green: {
    button: "bg-green-600 hover:bg-green-700",
    header: "bg-linear-to-r from-green-600 to-green-700",
    userMessage: "bg-green-600 text-white",
  },
  indigo: {
    button: "bg-indigo-600 hover:bg-indigo-700",
    header: "bg-linear-to-r from-indigo-600 to-indigo-700",
    userMessage: "bg-indigo-600 text-white",
  },
}

export type ChatPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left"

export const CHAT_POSITIONS: Record<ChatPosition, string> = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
}

export const MAX_MESSAGES_HISTORY = 50

export const API_REQUEST_TIMEOUT = 30000

export const DEFAULT_MESSAGES = {
  welcome: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte con tus finanzas?",
  error:
    "Lo siento, hubo un error al procesar tu pregunta. Por favor, verifica que la API key de Gemini esté configurada.",
  apiError: "Error al comunicarse con el servidor. Por favor, intenta de nuevo.",
}

export const hasApiKey = (): boolean => {
  return typeof window === "undefined" ? false : !!process.env.NEXT_PUBLIC_API_BASE_URL
}

export const truncateMessage = (message: string, maxLength: number = 500): string => {
  return message.length > maxLength ? message.substring(0, maxLength) + "..." : message
}

export const clearOldMessages = (
  messages: Record<string, unknown>[],
  maxMessages: number = MAX_MESSAGES_HISTORY
) => {
  return messages.slice(-maxMessages)
}
