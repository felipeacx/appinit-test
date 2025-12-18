import type { Metadata } from "next"

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${BASE_URL}${cleanPath}`
}

export function generateOpenGraphMetadata(
  title: string,
  description: string,
  path: string,
  imageUrl?: string
): Metadata["openGraph"] {
  return {
    type: "website",
    locale: "es_ES",
    url: generateCanonicalUrl(path),
    title,
    description,
    siteName: "Finanzas App",
    images: imageUrl
      ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
            type: "image/png",
          },
        ]
      : undefined,
  }
}

export function generateTwitterMetadata(title: string, description: string, imageUrl?: string) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: imageUrl ? [imageUrl] : undefined,
  }
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  options?: {
    keywords?: string[]
    imageUrl?: string
    noindex?: boolean
    nofollow?: boolean
  }
): Metadata {
  const ogMetadata = generateOpenGraphMetadata(title, description, path, options?.imageUrl)
  const twitterMetadata = generateTwitterMetadata(title, description, options?.imageUrl)

  return {
    title,
    description,
    keywords: options?.keywords,
    alternates: {
      canonical: generateCanonicalUrl(path),
    },
    openGraph: ogMetadata,
    twitter: twitterMetadata,
    robots: {
      index: !options?.noindex,
      follow: !options?.nofollow,
    },
  }
}

export interface SchemaOrgMetadata {
  "@context": string
  "@type": string
  [key: string]: unknown
}

export function generateOrganizationSchema(): SchemaOrgMetadata {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finanzas App",
    url: BASE_URL,
    description: "Aplicación moderna para gestionar transacciones y finanzas personales",
    logo: `${BASE_URL}/logo.png`,
    sameAs: [],
  }
}

export function generateApplicationSchema(): SchemaOrgMetadata {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Finanzas App",
    applicationCategory: "FinanceApplication",
    description:
      "Aplicación moderna para gestionar transacciones, ingresos y gastos de forma inteligente",
    url: BASE_URL,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }
}

export function injectSchemaOrgData(schema: SchemaOrgMetadata): string {
  return JSON.stringify(schema)
}
