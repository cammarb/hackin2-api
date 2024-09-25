import type { CompanyRole, Role } from '@prisma/client'

declare module 'express-session' {
  interface SessionData {
    user: {
      logged_in: boolean
      id: string
      username: string
      role: Role
      company?: {
        id: string
        role: CompanyRole
      }
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      id?: string
      err?: string
      username?: string
      role?: string
    }
  }
}
