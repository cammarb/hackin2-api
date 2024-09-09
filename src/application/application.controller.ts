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
import type { SessionData } from 'express-session'

export const addApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const programId = req.body.programId
    const { id } = req.session.user as SessionData['user']

    const application = await addApplication(id, programId)
    if (!application) throw new ConflictError()

    res.sendStatus(204)
  } catch (error) {
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
