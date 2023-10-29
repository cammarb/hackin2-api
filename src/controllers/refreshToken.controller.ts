import { Request, Response } from 'express'
import prisma from '../config/db'
import { RefreshToken, User } from '@prisma/client'
import { generateTokens } from '../config/auth'
import jwt from 'jsonwebtoken'

const handleRefreshToken = async (req: Request, res: Response) => {
  const header = req.headers
  if (!header.authorization) return res.status(401)
  const refreshToken = header.authorization

  const user: User | null = await prisma.user.findFirst({
    where: {
      RefreshToken: {
        some: {
          hashedToken: refreshToken,
        },
      },
    },
  })
  if (!user) return res.sendStatus(403) // Forbidden

  const tokenSecretKey = process.env.SECRET_KEY
  const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY

  if (!tokenSecretKey || !refreshTokenSecretKey) {
    return res.sendStatus(403)
  } else {
    jwt.verify(refreshToken, refreshTokenSecretKey, (err, decoded) => {
      if (
        err ||
        !decoded ||
        user.username !== (decoded as { username: string }).username
      ) {
        return res.sendStatus(403)
      }

      const accessToken = jwt.sign(
        { username: (decoded as { username: string }).username },
        tokenSecretKey,
        { expiresIn: '30s' }
      )

      res.json({ accessToken })
    })
  }
}

export { handleRefreshToken }
