import express, { Application, Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './routes/user.routes'
import authRouter from './routes/auth.routes'
import cookieParser from 'cookie-parser'

dotenv.config()

const app: Application = express()

app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'], // Allow only specified HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
)
app.use(express.json())

app.use('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello Hackin2' })
})
app.use('/user', userRouter)
app.use('/auth', authRouter)

export default app
