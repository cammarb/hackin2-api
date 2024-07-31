import { randomUUID } from 'crypto'
import { NextFunction, Request, Response } from 'express'

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = randomUUID()
  next()
}
