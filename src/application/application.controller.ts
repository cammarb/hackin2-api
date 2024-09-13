import type { NextFunction, Request, Response } from 'express'
import {
  addApplication,
  getApplicationById,
  getApplications,
  updateApplicaton
} from './application.service'
import {
  BadRequestError,
  ConflictError,
  ResourceNotFoundError
} from '../error/apiError'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const addApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bountyId, userId } = req.body

    const application = await addApplication(userId, bountyId)
    if (!application) throw new ConflictError()

    res.sendStatus(204)
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return next(
          new ConflictError('You have already applied to this bounty.')
        )
      }
    }
    next(error)
  }
}

export const getApplicationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query
    const applications = await getApplications(query)
    if (!applications) throw new ResourceNotFoundError()

    return res.status(200).json({ applications: applications })
  } catch (error) {
    next(error)
  }
}

export const getApplicationByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id
    const application = await getApplicationById(id)
    if (!application) throw new ResourceNotFoundError()

    return res.status(200).json({ application: application })
  } catch (error) {
    next(error)
  }
}

export const updateApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id
    const { status, bountyId, user } = req.body
    const application = await updateApplicaton(id, status, bountyId, user)
    if (!application) throw new BadRequestError()

    return res.status(200).json({ application: application })
  } catch (error) {
    next(error)
  }
}
