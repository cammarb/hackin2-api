import { Router } from 'express'
import { allowedRoles } from '../middleware/roles.middleware'
import { getBounties, getBountyById } from './bounty.service'
import {
  addBountyController,
  deleteBountyController,
  editBountyController,
} from './bounty.controller'

export const bountyRouter: Router = Router()

bountyRouter.get('/', allowedRoles(['OWNER', 'ADMIN', 'MEMBER']), getBounties)
bountyRouter.get(
  '/:id',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getBountyById,
)
bountyRouter.post('/new', allowedRoles(['OWNER', 'ADMIN']), addBountyController)
bountyRouter.put(
  '/:id/edit',
  allowedRoles(['OWNER', 'ADMIN']),
  editBountyController,
)
bountyRouter.delete(
  '/:id/delete',
  allowedRoles(['OWNER', 'ADMIN']),
  deleteBountyController,
)
