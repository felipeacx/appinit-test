import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar Sesión | Finanzas App - Acceso Seguro",
  description:
    "Inicia sesión en tu cuenta de Finanzas App para acceder a tu panel de control financiero. Acceso seguro con autenticación de dos factores.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Iniciar Sesión | Finanzas App",
    description:
      "Inicia sesión en tu cuenta de Finanzas App para acceder a tu panel de control financiero.",
    url: "/login",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: false,
    follow: true,
  },
}
