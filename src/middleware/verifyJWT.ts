import { NextFunction, Request, Response } from 'express'
import jwt, { DecodeOptions } from 'jsonwebtoken'

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(401)
  const token = authHeader.split(' ')[1]

  const secret = process.env.JWT_ACCESS_SECRET
  if (secret) {
    try {
      const decoded = jwt.verify(token, secret)
      next()
    } catch (err: any) {
      res.status(401).json({ Unauthorized: err?.message })
    }
  } else {
    res.status(401).json({ error: 'Verification failed' })
  }
}

export { verifyJWT }
