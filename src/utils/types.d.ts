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

  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      PUBLIC_KEY: string
      PRIVATE_KEY: string
      ISSUER: string
      ORIGIN: string
      OTP_SERVICE: string
      OTP_USER: string
      OTP_PASS: string
      CLOUDINARY_CLOUD_NAME: string
      CLOUDINARY_API_KEY: string
      CLOUDINARY_API_SECRET: string
      STRIPE_SECRET_KEY: string
      STRIPE_WEBHOOK_SECRET: string
      CACHE_HOSTNAME: string
      CACHE_PORT: string
      CACHE_PASS: string
    }
  }
}
