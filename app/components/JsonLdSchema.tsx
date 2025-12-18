import { generateOrganizationSchema, generateApplicationSchema } from "@/app/lib/seo"

export function JsonLdSchema() {
  const organizationSchema = generateOrganizationSchema()
  const applicationSchema = generateApplicationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }}
        suppressHydrationWarning
      />
    </>
  )
}
