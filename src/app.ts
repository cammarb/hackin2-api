import express, { Application, Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'

import userRouter from './routes/user.routes'
import authRouter from './routes/auth.routes'
import cookieParser from 'cookie-parser'

dotenv.config()

const app: Application = express()
const privateKey = fs.readFileSync(`${process.env.PRIVKEY}`, {
  encoding: 'utf-8',
})
const publicKey = fs.readFileSync(`${process.env.PUBKEY}`, {
  encoding: 'utf-8',
})
const issuer = process.env.ISSUER

app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'], // Allow only specified HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
)
app.use(express.json())

app.use('/user', userRouter)
app.use('/auth', authRouter)

export default app
export { privateKey, publicKey, issuer }
