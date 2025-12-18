"use client"

import { ReactNode } from "react"
import { GlobalProvider } from "./GlobalContext"
import { NotificationProvider } from "./NotificationContext"
import { ToastContainer } from "@/app/components/ToastContainer"

export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <GlobalProvider>
        <main id="main-content">{children}</main>
        <ToastContainer />
      </GlobalProvider>
    </NotificationProvider>
  )
}
