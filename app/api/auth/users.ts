import { UserRole } from "@/app/types/roles"

export interface MockUser {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    email: "test@example.com",
    password: "123456",
    name: "Usuario Test",
    role: "user",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    email: "juanfe1190@gmail.com",
    password: "123456",
    name: "Felipe Bonilla",
    role: "user",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "4",
    email: "usuario@example.com",
    password: "password123",
    name: "Usuario Común",
    role: "viewer",
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
]
