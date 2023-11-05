import { NextFunction, Request, Response } from 'express'
import jwt, { DecodeOptions } from 'jsonwebtoken'

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]
  const secret = process.env.ACCESS_TOKEN_SECRET

  if (!secret) {
    res.status(401).json({ error: 'Verification failed' })
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.sendStatus(403)

      next()
    })
  }
}

export { verifyJWT }
