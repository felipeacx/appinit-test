import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClientWrapper } from "./context/ClientWrapper"
import { JsonLdSchema } from "@/app/components/JsonLdSchema"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Finanzas App | Gestión de Transacciones y Finanzas Personales",
  description:
    "Aplicación moderna para gestionar tus ingresos, gastos y transacciones financieras de forma fácil, efectiva y segura. Control total de tus finanzas personales.",
  keywords: "finanzas, gestión financiera, transacciones, ingresos, gastos, app financiera",
  authors: [{ name: "Finanzas App Team" }],
  creator: "Finanzas App",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Finanzas App",
    title: "Finanzas App | Gestión de Transacciones y Finanzas Personales",
    description:
      "Aplicación moderna para gestionar tus ingresos, gastos y transacciones financieras de forma fácil, efectiva y segura.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Finanzas App - Gestión de Finanzas",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finanzas App | Gestión de Transacciones",
    description: "Aplicación moderna para gestionar tus finanzas personales de forma inteligente",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <JsonLdSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}
