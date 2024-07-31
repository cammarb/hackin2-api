import { Request } from 'express'

declare module 'express-session' {
  interface SessionData {
    logged_in: boolean
    id: string
    username: string
    role: 'ENTERPRISE' | 'ADMIN' | 'PENTESTER'
    company?: string
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
