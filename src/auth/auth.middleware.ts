import type { Request, Response, NextFunction } from 'express'
import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { redisClient } from '../utils/redis'
import {
  ForbiddenError,
  InvalidJWTError,
  JWTExpiredError,
  UnauthorizedError
} from '../error/apiError'

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers?.authorization

    if (!authHeader)
      throw new UnauthorizedError('Missing Authorization Headers')

    const token = authHeader.split(' ')[1]

    const decoded = verify(token, process.env.PUBLIC_KEY) as {
      username: string
      role: string
    }
    req.username = decoded.username
    req.role = decoded.role
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new JWTExpiredError(error.message))
    } else if (error instanceof JsonWebTokenError) {
      next(new InvalidJWTError(error.message))
    } else {
      next(error)
    }
  }
}

const checkSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.session
    if (!id) throw new UnauthorizedError()

    const userSession = await redisClient.get(`hackin2-api:${id}`)
    if (!userSession) throw new ForbiddenError()

    next()
  } catch (error) {
    next(error)
  }
}

export { verifyJWT, checkSession }
