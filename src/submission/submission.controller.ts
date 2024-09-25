import { type NextFunction, query, type Request, type Response } from 'express'
import {
  addSumission,
  getSubmissionById,
  getSubmissions,
  updateSubmission
} from './submission.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ConflictError, ResourceNotFoundError } from '../error/apiError'
import type { SessionData } from 'express-session'

export const addSumissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body
    const files = req.files

    if (!body) return res.status(400).json({ error: 'All fields are required' })

    const submission = await addSumission(body, files ? files : undefined)

    return res.status(200).json({ message: 'Submission Report sent' })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002')
        next(new ConflictError('User already submitted to this Bounty'))
    } else next(error)
  }
}

export const getSubmissionsController = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query

    const submissions = await getSubmissions(queryParams)

    if (submissions.length <= 0) throw new ResourceNotFoundError('submissions')

    return res.status(200).json({ submissions: submissions })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateSubmissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id
    const body = req.body

    const submissions = await updateSubmission(id, body)

    return res.status(200).json({ submissions: submissions })
  } catch (error) {
    next(error)
  }
}

export const getSubmissionByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id

    const submission = await getSubmissionById(id)

    if (submission == null)
      return res.status(400).json({ error: 'Resource not found' })

    return res.status(200).json({ submission: submission })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
