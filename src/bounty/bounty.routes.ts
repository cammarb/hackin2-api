import { Router } from 'express'
import { allowedRoles } from '../middleware/roles.middleware'
import {
  addBountyController,
  deleteBountyController,
  editBountyController,
  getBountiesController,
  getBountyByIdController
} from './bounty.controller'
import {
  validateQuery,
  ValidationCriteria
} from '../middleware/params.middleware'
import { validateUserSession } from '../middleware/session.middleware'

export const bountyRouter: Router = Router()

bountyRouter.get(
  '/',
  validateQuery(
    ['program', 'severity', 'status'],
    ValidationCriteria.AT_LEAST_ONE
  ),
  getBountiesController
)
bountyRouter.get(
  '/:id',
  validateUserSession,
  // allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getBountyByIdController
)
bountyRouter.post('/new', allowedRoles(['OWNER', 'ADMIN']), addBountyController)
bountyRouter.put(
  '/:id/edit',
  allowedRoles(['OWNER', 'ADMIN']),
  editBountyController
)
bountyRouter.delete(
  '/:id/delete',
  allowedRoles(['OWNER', 'ADMIN']),
  deleteBountyController
)
