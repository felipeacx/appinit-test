import { canUserPerform, hasAnyPermission, rolePermissions } from "../../types/roles"

describe("roles", () => {
  describe("rolePermissions", () => {
    it("should have all role types defined", () => {
      expect(rolePermissions).toHaveProperty("admin")
      expect(rolePermissions).toHaveProperty("user")
      expect(rolePermissions).toHaveProperty("viewer")
    })

    it("should have correct permissions for admin", () => {
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

    it("should have correct permissions for user", () => {
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

    it("should have correct permissions for viewer", () => {
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
    it("should return true for admin with any permission", () => {
      expect(canUserPerform("admin", "create:transaction")).toBe(true)
      expect(canUserPerform("admin", "manage:users")).toBe(true)
      expect(canUserPerform("admin", "manage:roles")).toBe(true)
      expect(canUserPerform("admin", "read:transaction")).toBe(true)
    })

    it("should return true for user with transaction permissions", () => {
      expect(canUserPerform("user", "create:transaction")).toBe(true)
      expect(canUserPerform("user", "read:transaction")).toBe(true)
      expect(canUserPerform("user", "update:transaction")).toBe(true)
      expect(canUserPerform("user", "delete:transaction")).toBe(true)
      expect(canUserPerform("user", "share:transaction")).toBe(true)
    })

    it("should return false for user without admin permissions", () => {
      expect(canUserPerform("user", "manage:users")).toBe(false)
      expect(canUserPerform("user", "manage:roles")).toBe(false)
    })

    it("should return true for viewer only with read permission", () => {
      expect(canUserPerform("viewer", "read:transaction")).toBe(true)
      expect(canUserPerform("viewer", "create:transaction")).toBe(false)
      expect(canUserPerform("viewer", "update:transaction")).toBe(false)
      expect(canUserPerform("viewer", "delete:transaction")).toBe(false)
      expect(canUserPerform("viewer", "share:transaction")).toBe(false)
    })

    it("should return false for viewer with any admin permission", () => {
      expect(canUserPerform("viewer", "manage:users")).toBe(false)
      expect(canUserPerform("viewer", "manage:roles")).toBe(false)
    })
  })

  describe("hasAnyPermission", () => {
    it("should return true if user has at least one permission", () => {
      expect(hasAnyPermission("user", ["manage:users", "create:transaction"])).toBe(true)
      expect(hasAnyPermission("admin", ["manage:users"])).toBe(true)
    })

    it("should return false if user has none of the permissions", () => {
      expect(hasAnyPermission("viewer", ["create:transaction", "update:transaction"])).toBe(false)
      expect(hasAnyPermission("user", ["manage:users", "manage:roles"])).toBe(false)
    })

    it("should return false for empty permissions array", () => {
      expect(hasAnyPermission("admin", [])).toBe(false)
      expect(hasAnyPermission("user", [])).toBe(false)
    })

    it("should work with single permission in array", () => {
      expect(hasAnyPermission("user", ["create:transaction"])).toBe(true)
      expect(hasAnyPermission("viewer", ["read:transaction"])).toBe(true)
      expect(hasAnyPermission("viewer", ["create:transaction"])).toBe(false)
    })

    it("admin should have any permission", () => {
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
