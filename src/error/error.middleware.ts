import { NextFunction, Request, Response } from 'express'
import { ApiError } from './apiError'

export const logErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    req.err = `Exception="${err.constructor.name}" Message="${err.message}"`
  } else {
    req.err = `Exception="${err.name}" Message="${err.message}"`
  }

  next(err)
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })
  } else {
    res.status(500).json({
      message: 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })
  }
}
