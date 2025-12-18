"use client"

import { useNotifications } from "@/app/context/NotificationContext"
import { BiCheck, BiX, BiInfoCircle } from "react-icons/bi"
import { MdWarning } from "react-icons/md"
import { useState } from "react"

export function ToastContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed bottom-4 right-4 z-9999 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

interface ToastProps {
  notification: {
    id: string
    type: "success" | "error" | "info" | "warning"
    title: string
    message: string
    action?: {
      label: string
      onClick: () => void
    }
  }
  onClose: () => void
}

function Toast({ notification, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 200)
  }

  const typeConfig = {
    success: {
      bg: "bg-success/50",
      border: "border-success/20",
      icon: <BiCheck className="text-success text-xl" />,
      iconBg: "bg-success/20",
    },
    error: {
      bg: "bg-error/50",
      border: "border-error/20",
      icon: <BiX className="text-error text-xl" />,
      iconBg: "bg-error/20",
    },
    info: {
      bg: "bg-primary/50",
      border: "border-primary/20",
      icon: <BiInfoCircle className="text-primary text-xl" />,
      iconBg: "bg-primary/20",
    },
    warning: {
      bg: "bg-warning/50",
      border: "border-warning/20",
      icon: <MdWarning className="text-warning text-xl" />,
      iconBg: "bg-warning/20",
    },
  }

  const config = typeConfig[notification.type]

  return (
    <div
      className={`${config.bg} ${
        config.border
      } border rounded-lg p-4 shadow-lg transform transition-all duration-200 ${
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div className="flex items-start gap-3">
        {}
        <div className={`${config.iconBg} rounded-lg p-2 shrink-0`}>{config.icon}</div>

        {}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text">{notification.title}</h3>
          <p className="text-sm text-text-secondary mt-1">{notification.message}</p>

          {}
          {notification.action && (
            <button
              onClick={() => {
                notification.action!.onClick()
                handleClose()
              }}
              className="text-sm font-semibold mt-2 text-primary hover:opacity-80 transition"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {}
        <button
          onClick={handleClose}
          className="text-text-secondary hover:text-text transition p-1 shrink-0"
        >
          <BiX className="text-lg" />
        </button>
      </div>
    </div>
  )
}
