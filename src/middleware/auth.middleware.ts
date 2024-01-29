import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { publicKey } from '../app'

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers && req.headers['authorization']
  const secret = publicKey

  if (!authHeader || !secret) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, secret) as {
      username: string
      role: string
    }
    req.params.username = decoded.username
    req.params.role = decoded.role
    next()
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.sendStatus(403)
    } else if (error.name === 'JsonWebTokenError') {
      res.sendStatus(401)
    } else res.sendStatus(500)
  }
}

export { verifyJWT }
