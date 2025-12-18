export type NotificationType = "success" | "error" | "info" | "warning"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
  success: (title: string, message: string, duration?: number) => string
  error: (title: string, message: string, duration?: number) => string
  info: (title: string, message: string, duration?: number) => string
  warning: (title: string, message: string, duration?: number) => string
}

export const NOTIFICATION_DURATIONS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
  PERSISTENT: 0,
} as const
