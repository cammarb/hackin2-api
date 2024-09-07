import { Router } from 'express'
import { allowedRoles } from '../middleware/roles.middleware'
import {
  addBountyController,
  deleteBountyController,
  editBountyController,
  getBountiesController,
  getBountyByIdController
} from './bounty.controller'

export const bountyRouter: Router = Router()

bountyRouter.get(
  '/',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getBountiesController
)
bountyRouter.get(
  '/:id',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
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
