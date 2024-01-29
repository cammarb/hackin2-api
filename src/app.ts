import express, { Application, Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'
import morgan from 'morgan'

import userRouter from './routes/user.routes'
import authRouter from './routes/auth.routes'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import gigRouter from './routes/gig.routes'

dotenv.config()

const app: Application = express()
const privateKey = fs.readFileSync(`${process.env.PRIVKEY}`, {
  encoding: 'utf-8',
})
const publicKey = fs.readFileSync(`${process.env.PUBKEY}`, {
  encoding: 'utf-8',
})
const issuer = process.env.ISSUER
const origin = process.env.ORIGIN

app.disable('x-powered-by')
app.use(
  cors({
    origin: origin,
    methods: ['GET', 'POST', 'PUT'], // Allow only specified HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  }),
)
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send('Welcome to the Hackin2 API.')
})
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/gig', gigRouter)

export default app
export { privateKey, publicKey, issuer }
