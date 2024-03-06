import express from 'express'
import dotenv from 'dotenv'
import createServer from './utilts/server'
import log from './utilts/logger'

dotenv.config()

const app = createServer()
const port = 8000

app.listen(port, () => {
  log.info(`Server is running at http://localhost:${port}`)
})
