import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { randomUUID } from 'node:crypto'
import express, { type Application } from 'express'
import fileUpload from 'express-fileupload'
import session from 'express-session'
import helmet from 'helmet'
import { errorHandler, logErrors } from '../error/error.middleware'
import { requestId } from '../middleware/requestId.middleware'
import { logger } from './logger'
import { connectRedis, redisStore } from './redis'
import routes from './routes'
import { stripeWebhook } from '../payment/payment.controller'
import { raw } from '@prisma/client/runtime/library'

const createServer = async () => {
  const app: Application = express()

  await connectRedis()

  app.use(
    cors({
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
      credentials: true
    })
  )

  app.use(cookieParser())

  app.use(
    session({
      store: redisStore,
      resave: false,
      saveUninitialized: false,
      secret: 'redis-secret',
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
      },
      genid: () => randomUUID()
    })
  )

  app.use(requestId)
  app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }))
  app.disable('x-powered-by')
  app.use(compression())
  app.use(helmet())
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): void => {
      if (req.originalUrl === '/api/v1/stripe_webhooks') {
        next()
      } else {
        express.json()(req, res, next)
      }
    }
  )
  app.use(logger())

  routes(app)

  app.use(logErrors)
  app.use(errorHandler)

  return app
}

export default createServer
