import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import routes from '../routes'

const createServer = () => {
  const app: Application = express()
  app.disable('x-powered-by')
  app.use(
    cors({
      origin: 'http:/localhost:5734',
      methods: ['GET', 'POST', 'PUT'], // Allow only specified HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers)
    }),
  )
  app.use(helmet())
  app.use(cookieParser())
  app.use(express.json())
  routes(app)
  return app
}

export default createServer
