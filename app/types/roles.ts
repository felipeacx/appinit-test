// Tipos de roles disponibles
export type UserRole = "admin" | "user" | "viewer"

// Permisos disponibles
export type Permission =
  | "create:transaction"
  | "read:transaction"
  | "update:transaction"
  | "delete:transaction"
  | "share:transaction"
  | "manage:users"
  | "manage:roles"

// Definir permisos por rol
export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "create:transaction",
    "read:transaction",
    "update:transaction",
    "delete:transaction",
    "share:transaction",
    "manage:users",
    "manage:roles",
  ],
  user: [
    "create:transaction",
    "read:transaction",
    "update:transaction",
    "delete:transaction",
    "share:transaction",
  ],
  viewer: ["read:transaction"],
}

export interface UserWithRole {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface SharedTransaction {
  transactionId: string
  userId: string
  sharedWith: string
  permission: "read" | "edit"
  sharedAt: string
}

export function canUserPerform(userRole: UserRole, permission: Permission): boolean {
  return rolePermissions[userRole].includes(permission)
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => canUserPerform(userRole, p))
}
