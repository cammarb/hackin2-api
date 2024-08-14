import { Router } from 'express'
import {
  getSubmissionByIdController,
  addSumissionController,
  getSubmissionsController,
  updateSubmissionController
} from './submission.controller'

export const submissionRouter: Router = Router()

submissionRouter.get('/', getSubmissionsController)
submissionRouter.get('/:id', getSubmissionByIdController)
submissionRouter.put('/:id/edit', updateSubmissionController)
submissionRouter.post('/new', addSumissionController)
