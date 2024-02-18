import express, { Router } from 'express'
import authRouter from './auth/auth.routes'
import userRouter from './pentester/user.routes'
import bountyRouter from './company/bounty.routes'
import companyRouter from './company/company.routes'

const apiRouter: Router = express.Router()

apiRouter.get('/', (req, res) => {
  res.send('Welcome to the Hackin2 API.')
})
apiRouter.use('/auth', authRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/company', companyRouter)

export default apiRouter
