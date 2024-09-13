import { Router } from 'express'
import {
  validateBody,
  validateParams,
  validateQuery,
  ValidationCriteria
} from '../middleware/params.middleware'
import {
  addApplicationController,
  getApplicationByIdController,
  getApplicationsController,
  updateApplicationController
} from './application.controller'
import type { ApplicationQuery } from './application.dto'

export const applicationRouter: Router = Router()

applicationRouter.post(
  '/new',
  validateBody(['userId', 'bountyId'], ValidationCriteria.ALL),
  addApplicationController
)
applicationRouter.get(
  '/',
  validateQuery<ApplicationQuery>(
    ['bounty', 'user', 'program'],
    ValidationCriteria.AT_LEAST_ONE
  ),
  getApplicationsController
)
applicationRouter.get(
  '/:id',
  validateParams(['id'], ValidationCriteria.ALL),
  getApplicationByIdController
)
applicationRouter.patch(
  '/:id/edit',
  validateParams(['id']),
  validateBody(['status'], ValidationCriteria.ALL),
  updateApplicationController
)
