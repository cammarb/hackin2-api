import { configDotenv } from 'dotenv'
import createServer from './utils/server'

configDotenv()

const startServer = async () => {
  const app = await createServer()
  const port = 8000

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
})
