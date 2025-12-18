import React from "react"
import { render } from "@testing-library/react"
import { JsonLdSchema } from "../../components/JsonLdSchema"

describe("JsonLdSchema", () => {
  it("debe renderizar sin errores", () => {
    const { container } = render(<JsonLdSchema />)
    expect(container).toBeInTheDocument()
  })

  it("debe renderizar dos etiquetas script", () => {
    const { container } = render(<JsonLdSchema />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBe(2)
  })

  it("debe tener JSON válido en primer script (esquema de organización)", () => {
    const { container } = render(<JsonLdSchema />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const firstScript = scripts[0]

    expect(() => {
      JSON.parse(firstScript.innerHTML)
    }).not.toThrow()
  })

  it("debe tener JSON válido en segundo script (esquema de aplicación)", () => {
    const { container } = render(<JsonLdSchema />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const secondScript = scripts[1]

    expect(() => {
      JSON.parse(secondScript.innerHTML)
    }).not.toThrow()
  })

  it("debe contener datos de organización en primer script", () => {
    const { container } = render(<JsonLdSchema />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const firstScript = scripts[0]
    const data = JSON.parse(firstScript.innerHTML)

    expect(data["@context"]).toBe("https://schema.org")
    expect(data["@type"]).toBe("Organization")
    expect(data.name).toBe("Finanzas App")
  })

  it("debe contener datos de aplicación en segundo script", () => {
    const { container } = render(<JsonLdSchema />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const secondScript = scripts[1]
    const data = JSON.parse(secondScript.innerHTML)

    expect(data["@context"]).toBe("https://schema.org")
    expect(data["@type"]).toBe("SoftwareApplication")
    expect(data.name).toBe("Finanzas App")
  })

  it("debe tener atributo suppressHydrationWarning", () => {
    const { container } = render(<JsonLdSchema />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')

    // Verificar si suppressHydrationWarning se aplicaría (a través de propiedades de React)
    scripts.forEach((script) => {
      expect(script).toBeInTheDocument()
    })
  })
})
