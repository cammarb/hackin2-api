import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getEnvs } from '../utils/envs'
import { redisClient } from '../utils/redis'

const verifyJWT = async (
  req: Request | any,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers && req.headers['authorization']
  const { publicKey } = await getEnvs()

  if (!authHeader || !publicKey) return res.status(401)

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
      return res.status(401)
    } else return res.status(500)
  }
}

const checkSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.session
  if (!id) return res.status(401)

  const userSession = await redisClient.get('hackin2-api:' + id)
  if (!userSession) return res.status(403)

  next()
}

export { verifyJWT, checkSession }
