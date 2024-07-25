import { SessionData } from 'express-session'

declare module 'express-session' {
  interface SessionData {
    logged_in: boolean
    user: {
      id: string
      username: string
      role: 'ENTERPRISE' | 'ADMIN' | 'PENTESTER'
      company?: string
    }
  }
}