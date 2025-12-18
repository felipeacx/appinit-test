"use client"

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react"
import {
  Notification,
  NotificationContextType,
  NotificationType,
  NOTIFICATION_DURATIONS,
} from "@/app/types/notifications"

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
  }, [])

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp">): string => {
      const id = `${Date.now()}-${Math.random()}`
      const duration = notification.duration ?? NOTIFICATION_DURATIONS.MEDIUM
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: Date.now(),
        duration,
      }

      setNotifications((prev) => [...prev, newNotification])

      if (duration > 0) {
        const timeout = setTimeout(() => {
          removeNotification(id)
        }, duration)
        timeoutsRef.current.set(id, timeout)
      }

      return id
    },
    [removeNotification]
  )

  const clearNotifications = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current.clear()
    setNotifications([])
  }, [])

  const createTypedNotification = (type: NotificationType) => {
    return (title: string, message: string, duration?: number): string => {
      return addNotification({
        type,
        title,
        message,
        duration,
      })
    }
  }

  const success = createTypedNotification("success")
  const error = createTypedNotification("error")
  const info = createTypedNotification("info")
  const warning = createTypedNotification("warning")

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    info,
    warning,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}
