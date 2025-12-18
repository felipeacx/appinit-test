import { NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.GEMINI_API_KEY || ""
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    const systemPrompt = `Eres un asistente de IA amigable especializado en ayudar a usuarios de una aplicación de gestión financiera. 
      Tu rol es responder preguntas sobre:
      - Gestión de finanzas personales
      - Consejos de ahorro y presupuesto
      - Explicación de transacciones financieras
      - Recomendaciones sobre gastos
      - Funcionalidades de la aplicación

      Sé conciso, amable y proporciona respuestas útiles, cortas y prácticas. Usa español en tus respuestas.`

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUsuario: ${message}`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated"

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Detailed error:", errorMessage)
    return NextResponse.json(
      { error: `Failed to process your request: ${errorMessage}` },
      { status: 500 }
    )
  }
}
