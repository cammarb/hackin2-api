import { Router } from 'express'
import authRouter from './auth.routes'
import { verifyJWT } from '../middleware/auth.middleware'
import userRouter from './user.routes'
import { checkEnterprise } from '../middleware/roles.middleware'
import companyRouter from './company.routes'

export const apiRoutes: Router = Router()

apiRoutes.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Hackin2 API.' })
})
apiRoutes.use('/auth', authRouter)
apiRoutes.use('/user', verifyJWT, userRouter)
apiRoutes.use('/company', verifyJWT, checkEnterprise, companyRouter)