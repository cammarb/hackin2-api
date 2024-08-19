import { Router } from 'express'
import {
  validateBody,
  validateParams,
  validateQuery,
  ValidationCriteria
} from '../middleware/params.middleware'
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
  validateUserSession,
  validateBody(['programId'], ValidationCriteria.ALL),
  addApplicationController
)
applicationRouter.get(
  '/',
  validateQuery(['program', 'user'], ValidationCriteria.AT_LEAST_ONE),
  getApplicationsController
)
applicationRouter.get(
  '/:id',
  validateUserSession,
  validateParams(['id'], ValidationCriteria.ALL),
  getApplicationsController
)
applicationRouter.patch(
  '/:id/edit',
  validateUserSession,
  validateParams(['id']),
  validateBody(['status'], ValidationCriteria.ALL),
  updateApplicationController
)
