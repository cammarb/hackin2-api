import { Router } from 'express'
import { validateBody, validateParams } from '../middleware/params.middleware'
import {
  addApplicationController,
  getApplicationsController,
  updateApplicationController
} from './application.controller'
import { checkSession } from '../auth/auth.middleware'
import { validateUserSession } from '../middleware/session.middleware'

export const applicationRouter: Router = Router()

applicationRouter.post(
  '/new',
  validateBody(['userId', 'programId']),
  addApplicationController
)
applicationRouter.get('/', getApplicationsController)
applicationRouter.get(
  '/:id',
  validateUserSession,
  validateParams(['id']),
  getApplicationsController
)
applicationRouter.patch(
  '/:id/edit',
  validateParams(['id']),
  validateBody(['status']),
  updateApplicationController
)
