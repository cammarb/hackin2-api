import dotenv from 'dotenv'
import createServer from './utils/server'

dotenv.config()

const startServer = async () => {
  const app = await createServer()
  const port = Number(process.env.PORT) || 3000

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
})
