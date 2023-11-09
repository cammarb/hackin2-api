import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './src/routes/user.routes'
import authRouter from './src/routes/auth.routes'
import cookieParser from 'cookie-parser'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.use('/user', userRouter)
app.use('/auth', authRouter)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
