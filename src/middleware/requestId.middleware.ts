import { randomUUID } from 'crypto'
import type { NextFunction, Request, Response } from 'express'

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = randomUUID()
  next()
}
