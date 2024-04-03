import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import getEnvs from '../utilts/envs'

const verifyJWT = async (
  req: Request | any,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers && req.headers['authorization']
  const { publicKey } = await getEnvs()

  if (!authHeader || !publicKey) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, publicKey) as {
      username: string
      role: string
    }
    req.username = decoded.username
    req.role = decoded.role
    next()
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired' })
    } else if (error.name === 'JsonWebTokenError') {
      return res.sendStatus(401)
    } else return res.sendStatus(500)
  }
}

export { verifyJWT }
