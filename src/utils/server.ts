import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { randomUUID } from 'crypto'
import express, { type Application } from 'express'
import fileUpload from 'express-fileupload'
import session from 'express-session'
import helmet from 'helmet'
import { errorHandler, logErrors } from '../error/error.middleware'
import { requestId } from '../middleware/requestId.middleware'
import { logger } from './logger'
import { connectRedis, redisStore } from './redis'
import routes from './routes'

const createServer = async () => {
  const app: Application = express()

  await connectRedis()

  app.use(
    cors({
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST', 'PUT'],
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
  app.use(express.json())
  app.use(logger())

  routes(app)

  app.use(logErrors)
  app.use(errorHandler)

  return app
}

export default createServer
