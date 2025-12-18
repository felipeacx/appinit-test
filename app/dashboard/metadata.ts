import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Finanzas App - Tu Centro de Control Financiero",
  description:
    "Panel de control personalizado para monitorear transacciones, ingresos y gastos en tiempo real. Gestiona tus finanzas con eficiencia.",
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    title: "Dashboard | Finanzas App",
    description:
      "Panel de control personalizado para monitorear transacciones, ingresos y gastos en tiempo real.",
    url: "/dashboard",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: false,
    follow: false,
  },
}
