import express, { Application, Response, Request } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import routes from './routes'
import morgan from 'morgan'
import { connectRedis, redisClient, redisStore } from './redis'
import session from 'express-session'
import { randomUUID } from 'crypto'
import fileUpload from 'express-fileupload'
import compression from 'compression'
import { errorHandler, logErrors } from '../error/error.middleware'
import { requestId } from '../middleware/requestId.middleware'
import { logger } from './logger'

const createServer = async () => {
  const app: Application = express()

  await connectRedis()

  app.use(requestId)
  app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }))
  app.disable('x-powered-by')
  app.use(
    cors({
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST', 'PUT'], // Allow only specified HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers)
    }),
  )
  app.use(compression())
  app.use(helmet())
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
        maxAge: 24 * 60 * 60 * 1000,
      },
      genid: () => randomUUID(),
    }),
  )
  app.use(cookieParser())
  app.use(express.json())
  app.use(logger())
  routes(app)
  app.use(logErrors)
  app.use(errorHandler)

  return app
}

export default createServer
