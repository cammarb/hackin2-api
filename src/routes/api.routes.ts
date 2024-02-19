import express, { Router } from 'express'
import authRouter from './auth.routes'
import companyRouter from './company.routes'
import userRouter from './user.routes'
import { verifyJWT } from '../middleware/auth.middleware'
import { checkEnterprise } from '../middleware/roles.middleware'

const apiRouter: Router = express.Router()

apiRouter.get('/', (req, res) => {
  res.send('Welcome to the Hackin2 API.')
})
apiRouter.use('/auth', authRouter)
apiRouter.use('/user', verifyJWT, userRouter)
apiRouter.use('/company', verifyJWT, checkEnterprise, companyRouter)

export default apiRouter
