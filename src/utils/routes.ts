import { Application } from 'express'
import { Router } from 'express'
import { authRouter } from '../auth/auth.routes'
import { userRouter } from '../user/user.routes'
import { companyRouter } from '../company/company.routes'
import { programRouter } from '../program/program.routes'
import { bountyRouter } from '../bounty/bounty.routes'
import { submissionRouter } from '../submission/submission.routes'
import { severityRewardRouter } from '../severityReward/severityReward.routes'
import { verifyJWT } from '../auth/auth.middleware'
import { checkEnterprise, checkPentester } from '../middleware/roles.middleware'

const routes = (app: Application) => {
  const apiRoutes: Router = Router()

  apiRoutes.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Hackin2 API.' })
  })
  apiRoutes.use('/auth', authRouter)
  apiRoutes.use('/user', verifyJWT, userRouter)

  apiRoutes.use('/company', verifyJWT, checkEnterprise, companyRouter)

  apiRoutes.use('/programs', verifyJWT, programRouter)
  apiRoutes.use('/bounties', verifyJWT, bountyRouter)
  apiRoutes.use('/submissions', verifyJWT, submissionRouter)
  apiRoutes.use('/severityRewards', verifyJWT, severityRewardRouter)

  app.get('/', (req, res) => {
    res.redirect(301, '/api/v1')
  })

  app.use('/api/v1', apiRoutes)
}

export default routes
