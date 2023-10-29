import { Request, Response } from 'express'
import prisma from '../config/db'
import { RefreshToken, User } from '@prisma/client'
import { generateTokens } from '../config/auth'
import { verifyJWT } from '../middleware/verifyJWT'

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

  verifyJWT(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403)
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    )
    res.json({ accessToken })
  })
}

export { handleRefreshToken }
