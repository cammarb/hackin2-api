import type { Role } from '@prisma/client'

export interface UpdateUser {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
}

export interface UpdateUserPassword {
  currentPassword: string
  newPassword: string
}

export interface UserQueryParams {
  role?: string
}

export interface NewUserBody {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  role: Role
  company?: {
    name: string
    website: string
    email: string
  }
}

export interface LoginUserBody {
  username: string
  password: string
}
