import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel de Administración | Finanzas App - Gestión de Usuarios",
  description:
    "Panel administrativo para gestionar usuarios, permisos y configuración del sistema. Solo para administradores.",
  alternates: {
    canonical: "/admin",
  },
  openGraph: {
    title: "Panel de Administración | Finanzas App",
    description:
      "Panel administrativo para gestionar usuarios, permisos y configuración del sistema.",
    url: "/admin",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: false,
    follow: false,
  },
}
