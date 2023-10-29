import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'

import userRouter from './src/routes/user.routes'
import authRouter from './src/routes/auth.routes'
import refreshRouter from './src/routes/refresh.routes'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.use('/user', userRouter)
app.use('/login', authRouter)
app.use('/refresh', refreshRouter)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
