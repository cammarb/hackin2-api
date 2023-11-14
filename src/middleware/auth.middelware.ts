import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const secret = await fs.promises.readFile(`${process.env.PUBKEY}`, 'utf8')

  if (!authHeader || !secret) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, secret) as {
      username: string
      role: string
    }

    req.params.username = decoded.username
    req.params.roleId = decoded.role
    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}

export { verifyJWT }
