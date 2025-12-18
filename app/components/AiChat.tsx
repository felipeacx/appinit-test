"use client"

import { useState, useRef, useEffect } from "react"
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi"
import ReactMarkdown from "react-markdown"
import type { ChatMessage } from "@/app/types/chat"

export const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte con tus finanzas?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: "Lo siento, hubo un error al procesar tu pregunta. Por favor, verifica que la API key de Gemini esté configurada.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 font-sans overflow-hidden">
          {}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <FiMessageCircle className="text-lg" />
              <h3 className="font-semibold">Asistente de IA</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-800 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                  }`}
                >
                  {message.sender === "ai" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: (props) => <ul className="list-disc list-inside mb-2" {...props} />,
                          ol: (props) => (
                            <ol className="list-decimal list-inside mb-2" {...props} />
                          ),
                          li: (props) => <li className="mb-1" {...props} />,
                          h1: (props) => <h1 className="text-lg font-bold mb-2" {...props} />,
                          h2: (props) => <h2 className="text-base font-bold mb-2" {...props} />,
                          h3: (props) => <h3 className="text-sm font-bold mb-2" {...props} />,
                          strong: (props) => <strong className="font-bold" {...props} />,
                          em: (props) => <em className="italic" {...props} />,
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900 rounded-b-lg">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white text-sm disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                aria-label="Send message"
              >
                <FiSend className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 z-40"
        suppressHydrationWarning
      >
        {isOpen ? (
          <FiX className="text-2xl" />
        ) : (
          <FiMessageCircle className="text-3xl animate-pulse" />
        )}
      </button>
    </>
  )
}
