import type { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import { UnauthorizedError } from '../error/apiError'

export const validateUserSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userSession = req.session.user as SessionData['user']
    if (!userSession) throw new UnauthorizedError()

    next()
  } catch (error) {
    next(error)
  }
}
