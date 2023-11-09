import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import fs from 'fs'

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]

  const secret = fs.readFileSync(`${process.env.PUBKEY}`, 'utf8')

  if (!secret) res.status(401).json({ error: 'Verification failed' })

  const decoded = jwt.verify(token, secret)
  if (!decoded) return res.sendStatus(403)
  next()
}

export { verifyJWT }
