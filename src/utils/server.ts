import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import routes from '../routes'
import morgan from 'morgan'
import { connectRedis, redisSession } from './redis'

const createServer = () => {
  const app: Application = express()
  connectRedis()
  app.disable('x-powered-by')
  app.use(
    cors({
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST', 'PUT'], // Allow only specified HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers)
    }),
  )
  app.use(helmet())
  app.use(redisSession)
  app.use(cookieParser())
  app.use(express.json())
  app.use(morgan('dev'))
  routes(app)
  return app
}

export default createServer
