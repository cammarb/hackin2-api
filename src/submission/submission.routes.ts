import { Router } from 'express'
import {
  getSubmissionByIdController,
  addSumissionController,
  getSubmissionsController
} from './submission.controller'

export const submissionRouter: Router = Router()

submissionRouter.get('/', getSubmissionsController)
submissionRouter.get('/:id', getSubmissionByIdController)
submissionRouter.post('/new', addSumissionController)
