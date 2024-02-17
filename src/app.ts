import express, { Application, Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'
import morgan from 'morgan'

import userRouter from './routes/api/v1/pentester/user.routes'
import authRouter from './routes/api/v1/auth/auth.routes'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import bountyRouter from './routes/api/v1/company/bounty.routes'
import apiRouter from './routes/api/v1/api.routes'

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

app.use('/api/v1', apiRouter)

export default app
export { privateKey, publicKey, issuer }
