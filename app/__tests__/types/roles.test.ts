import { canUserPerform, hasAnyPermission, rolePermissions } from "../../types/roles"

describe("roles", () => {
  describe("permisos por rol", () => {
    it("debe tener todos los tipos de rol definidos", () => {
      expect(rolePermissions).toHaveProperty("admin")
      expect(rolePermissions).toHaveProperty("user")
      expect(rolePermissions).toHaveProperty("viewer")
    })

    it("debe tener permisos correctos para admin", () => {
      const adminPermissions = rolePermissions.admin
      expect(adminPermissions).toContain("create:transaction")
      expect(adminPermissions).toContain("read:transaction")
      expect(adminPermissions).toContain("update:transaction")
      expect(adminPermissions).toContain("delete:transaction")
      expect(adminPermissions).toContain("share:transaction")
      expect(adminPermissions).toContain("manage:users")
      expect(adminPermissions).toContain("manage:roles")
      expect(adminPermissions.length).toBe(7)
    })

    it("debe tener permisos correctos para usuario", () => {
      const userPermissions = rolePermissions.user
      expect(userPermissions).toContain("create:transaction")
      expect(userPermissions).toContain("read:transaction")
      expect(userPermissions).toContain("update:transaction")
      expect(userPermissions).toContain("delete:transaction")
      expect(userPermissions).toContain("share:transaction")
      expect(userPermissions).not.toContain("manage:users")
      expect(userPermissions).not.toContain("manage:roles")
      expect(userPermissions.length).toBe(5)
    })

    it("debe tener permisos correctos para visor", () => {
      const viewerPermissions = rolePermissions.viewer
      expect(viewerPermissions).toContain("read:transaction")
      expect(viewerPermissions).not.toContain("create:transaction")
      expect(viewerPermissions).not.toContain("update:transaction")
      expect(viewerPermissions).not.toContain("delete:transaction")
      expect(viewerPermissions).not.toContain("share:transaction")
      expect(viewerPermissions.length).toBe(1)
    })
  })

  describe("canUserPerform", () => {
    it("debe devolver verdadero para admin con cualquier permiso", () => {
      expect(canUserPerform("admin", "create:transaction")).toBe(true)
      expect(canUserPerform("admin", "manage:users")).toBe(true)
      expect(canUserPerform("admin", "manage:roles")).toBe(true)
      expect(canUserPerform("admin", "read:transaction")).toBe(true)
    })

    it("debe devolver verdadero para usuario con permisos de transacción", () => {
      expect(canUserPerform("user", "create:transaction")).toBe(true)
      expect(canUserPerform("user", "read:transaction")).toBe(true)
      expect(canUserPerform("user", "update:transaction")).toBe(true)
      expect(canUserPerform("user", "delete:transaction")).toBe(true)
      expect(canUserPerform("user", "share:transaction")).toBe(true)
    })

    it("debe devolver falso para usuario sin permisos de admin", () => {
      expect(canUserPerform("user", "manage:users")).toBe(false)
      expect(canUserPerform("user", "manage:roles")).toBe(false)
    })

    it("debe devolver verdadero para visor solo con permiso de lectura", () => {
      expect(canUserPerform("viewer", "read:transaction")).toBe(true)
      expect(canUserPerform("viewer", "create:transaction")).toBe(false)
      expect(canUserPerform("viewer", "update:transaction")).toBe(false)
      expect(canUserPerform("viewer", "delete:transaction")).toBe(false)
      expect(canUserPerform("viewer", "share:transaction")).toBe(false)
    })

    it("debe devolver falso para visor con cualquier permiso de admin", () => {
      expect(canUserPerform("viewer", "manage:users")).toBe(false)
      expect(canUserPerform("viewer", "manage:roles")).toBe(false)
    })
  })

  describe("hasAnyPermission", () => {
    it("debe devolver verdadero si el usuario tiene al menos un permiso", () => {
      expect(hasAnyPermission("user", ["manage:users", "create:transaction"])).toBe(true)
      expect(hasAnyPermission("admin", ["manage:users"])).toBe(true)
    })

    it("debe devolver falso si el usuario no tiene ninguno de los permisos", () => {
      expect(hasAnyPermission("viewer", ["create:transaction", "update:transaction"])).toBe(false)
      expect(hasAnyPermission("user", ["manage:users", "manage:roles"])).toBe(false)
    })

    it("debe devolver falso para array de permisos vacío", () => {
      expect(hasAnyPermission("admin", [])).toBe(false)
      expect(hasAnyPermission("user", [])).toBe(false)
    })

    it("debe funcionar con un solo permiso en el array", () => {
      expect(hasAnyPermission("user", ["create:transaction"])).toBe(true)
      expect(hasAnyPermission("viewer", ["read:transaction"])).toBe(true)
      expect(hasAnyPermission("viewer", ["create:transaction"])).toBe(false)
    })

    it("admin debe tener cualquier permiso", () => {
      const allPermissions: Array<
        | "create:transaction"
        | "read:transaction"
        | "update:transaction"
        | "delete:transaction"
        | "share:transaction"
        | "manage:users"
        | "manage:roles"
      > = [
        "create:transaction",
        "read:transaction",
        "update:transaction",
        "delete:transaction",
        "share:transaction",
        "manage:users",
        "manage:roles",
      ]
      expect(hasAnyPermission("admin", allPermissions)).toBe(true)
    })
  })
})
