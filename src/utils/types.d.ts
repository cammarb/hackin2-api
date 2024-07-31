import { Role } from '@prisma/client'
import { Request } from 'express'

declare module 'express-session' {
  interface SessionData {
    user: {
      logged_in: boolean
      id: string
      username: string
      role: Role
      company?: string
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      id?: string
      err?: string
    }
  }
}
