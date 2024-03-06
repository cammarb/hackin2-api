import { Application } from 'express'
import { apiRoutes } from './routes/api.routes'

const routes = (app: Application) => {
  app.get('/', (req, res) => {
    res.redirect(301, '/api/v1')
  })

  app.use('/api/v1', apiRoutes)
}

export default routes
