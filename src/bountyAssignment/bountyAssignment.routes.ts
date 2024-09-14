import { Router } from 'express'
import { allowedRoles } from '../middleware/roles.middleware'
import {
  validateQuery,
  ValidationCriteria
} from '../middleware/params.middleware'
import type { BountyAssignmentsQuery } from '../bounty/bounty.dto'
import { getBountyAssignmentsController } from '../bounty/bounty.controller'

export const bountyAssignmentRouter: Router = Router()

bountyAssignmentRouter.get(
  '/',
  validateQuery(['bounty', 'user'], ValidationCriteria.AT_LEAST_ONE),
  getBountyAssignmentsController
)
