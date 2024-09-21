import { Router } from 'express'
import {
  getSubmissionByIdController,
  addSumissionController,
  getSubmissionsController,
  updateSubmissionController
} from './submission.controller'
import {
  validateQuery,
  ValidationCriteria
} from '../middleware/params.middleware'
import type { SubmissionQueryParams } from './submission.dto'

export const submissionRouter: Router = Router()

submissionRouter.get(
  '/',
  validateQuery<SubmissionQueryParams>(
    ['user', 'bounty', 'program'],
    ValidationCriteria.AT_LEAST_ONE
  ),
  getSubmissionsController
)
submissionRouter.get('/:id', getSubmissionByIdController)
submissionRouter.put('/:id/edit', updateSubmissionController)
submissionRouter.post('/new', addSumissionController)
