/**
 * Configuración del Chat de IA
 * Ajusta estos valores para personalizar el comportamiento del chat
 */

export const chatConfig = {
  // Posición del chat en la pantalla
  position: {
    bottom: 24, // Distancia desde el fondo en píxeles
    right: 24, // Distancia desde la derecha en píxeles
  },

  // Dimensiones del chat
  dimensions: {
    width: 384, // w-96 = 24rem = 384px
    height: 384, // h-96 = 24rem = 384px
    buttonSize: 56, // 14rem = 56px
  },

  // Comportamiento del chat
  behavior: {
    // Auto-abrir el chat al cargar la página
    autoOpen: false,
    // Sonido al recibir mensaje
    soundEnabled: false,
    // Mostrar notificaciones del navegador
    notificationsEnabled: false,
  },

  // Animaciones
  animations: {
    // Duración de transiciones en milisegundos
    transitionDuration: 300,
    // Habilitar animaciones
    enabled: true,
  },

  // Máximo número de mensajes a guardar
  maxMessages: 50,

  // Timeout para requests a la API (en ms)
  requestTimeout: 30000,

  // Colores y temas
  theme: {
    primary: "blue", // blue, purple, green, indigo
    // Colores personalizados (sobrescribe el tema)
    custom: {
      button: "bg-blue-600 hover:bg-blue-700",
      header: "bg-linear-to-r from-blue-600 to-blue-700",
      userMessage: "bg-blue-600 text-white",
      aiMessage: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white",
    },
  },

  // Mensajes personalizados
  messages: {
    welcome: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte con tus finanzas?",
    placeholder: "Escribe tu pregunta...",
    error: "Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.",
    apiError: "Error al comunicarse con el servidor. Verifica que la API key está configurada.",
    loading: "Procesando...",
  },

  // Configuración de accesibilidad
  accessibility: {
    // Alto contraste
    highContrast: false,
    // Reducir movimiento
    reduceMotion: false,
    // Texto más grande
    largeText: false,
  },

  // Configuración de API
  api: {
    // Endpoint del chat
    endpoint: "/api/chat",
    // Método HTTP
    method: "POST" as const,
    // Headers adicionales
    headers: {
      "Content-Type": "application/json",
    },
  },

  // Sistema de prompts
  systemPrompt: {
    type: "financial", // financial, general, custom
    custom: `Eres un asistente de IA amigable especializado en ayudar a usuarios de una aplicación de gestión financiera. 
Tu rol es responder preguntas sobre:
- Gestión de finanzas personales
- Consejos de ahorro y presupuesto
- Explicación de transacciones financieras
- Recomendaciones sobre gastos
- Funcionalidades de la aplicación

Sé conciso, amigable y proporciona respuestas útiles y prácticas. Usa español en tus respuestas.`,
  },

  // Historial de conversaciones
  history: {
    // Guardar historial en localStorage
    persistLocally: false,
    // Llave de localStorage
    storageKey: "ai_chat_history",
  },

  // Integración con análisis
  analytics: {
    // Rastrear eventos del chat
    enabled: false,
    // ID de Google Analytics (si está disponible)
    googleAnalyticsId: null as string | null,
  },
}

/**
 * Tipo para la configuración del chat
 */
export type ChatConfig = typeof chatConfig

/**
 * Función para obtener la configuración actual
 */
export const getChatConfig = (): ChatConfig => {
  return chatConfig
}

/**
 * Función para actualizar la configuración
 * @param updates - Actualizaciones parciales de la configuración
 */
export const updateChatConfig = (updates: Partial<ChatConfig>): void => {
  Object.assign(chatConfig, updates)
}

/**
 * Función para resetear la configuración a valores por defecto
 */
export const resetChatConfig = (): void => {
  // Recargar el módulo (no funciona en runtime)
  console.warn("Para resetear la configuración, reinicia la aplicación")
}
