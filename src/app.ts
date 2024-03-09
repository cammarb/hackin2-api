import express from 'express'
import dotenv from 'dotenv'
import createServer from './utilts/server'

dotenv.config()

const app = createServer()
const port = 8000

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
