import { type Application, Router } from 'express'
import { verifyJWT } from '../auth/auth.middleware'
import { authRouter } from '../auth/auth.routes'
import { bountyRouter } from '../bounty/bounty.routes'
import { companyRouter } from '../company/company.routes'
import { checkEnterprise } from '../middleware/roles.middleware'
import { programRouter } from '../program/program.routes'
import { scopeRouter } from '../scope/scope.routes'
import { severityRewardRouter } from '../severityReward/severityReward.routes'
import { submissionRouter } from '../submission/submission.routes'
import { userRouter } from '../user/user.routes'
import { companyMemberRouter } from '../companyMember/companyMember.routes'
import { applicationRouter } from '../application/application.routes'
import { bountyAssignmentRouter } from '../bountyAssignment/bountyAssignment.routes'

const routes = (app: Application) => {
  const apiRoutes: Router = Router()

  apiRoutes.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Hackin2 API.' })
  })
  apiRoutes.use('/auth', authRouter)
  apiRoutes.use('/users', verifyJWT, userRouter)
  apiRoutes.use('/companies', verifyJWT, checkEnterprise, companyRouter)
  apiRoutes.use('/members', verifyJWT, checkEnterprise, companyMemberRouter)
  apiRoutes.use('/programs', verifyJWT, programRouter)
  apiRoutes.use('/applications', verifyJWT, applicationRouter)
  apiRoutes.use('/bounties', verifyJWT, bountyRouter)
  apiRoutes.use('/bounty-assignments', verifyJWT, bountyAssignmentRouter)
  apiRoutes.use('/submissions', verifyJWT, submissionRouter)
  apiRoutes.use('/severity-rewards', verifyJWT, severityRewardRouter)
  apiRoutes.use('/scopes', verifyJWT, scopeRouter)

  app.get('/', (req, res) => {
    res.redirect(301, '/api/v1')
  })

  app.use('/api/v1', apiRoutes)
}

export default routes
