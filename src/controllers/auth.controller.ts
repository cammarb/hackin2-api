import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../config/db'
import { RefreshToken, User } from '@prisma/client'
import { generateTokens } from '../config/auth'
import jwt, { JwtPayload } from 'jsonwebtoken'
import fs from 'fs'

const handleLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password)
    res.status(400).json({
      error: 'Bad Request',
      message: 'Both username and password are required',
    })

  const user: User | null = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })

  if (!user) {
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid username or password',
    })
  } else {
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password',
      })
    } else {
      const tokens = generateTokens(user)

      const refreshToken: RefreshToken = await prisma.refreshToken.create({
        data: {
          hashedToken: tokens.refreshToken,
          userId: user.id,
        },
      })

      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })

      res.status(200).json({
        message: 'Login successful',
        data: {
          token: `${tokens.accessToken}`,
        },
      })
    }
  }
}

const handleRefreshToken = async (req: Request, res: Response) => {
  const jwtCookie = req.cookies['jwt']
  if (!jwtCookie) return res.status(401).json({ message: 'Unauthorized' })

  const tokenSecretKey = fs.readFileSync(`${process.env.PUBKEY}`, 'utf8')

  if (!tokenSecretKey) return res.sendStatus(403)
  const decoded: JwtPayload = jwt.verify(
    jwtCookie,
    tokenSecretKey
  ) as JwtPayload

  if (!decoded) return res.sendStatus(403)

  const user: User | null = await prisma.user.findUnique({
    where: {
      username: decoded.username,
    },
  })
  if (!user) return res.sendStatus(403) // Forbidden

  // revoke old refreshToken and add new refreshToken to db
  const oldToken = await prisma.refreshToken.findUnique({
    where: {
      hashedToken: jwtCookie,
    },
  })
  const updatedToken = await prisma.refreshToken.update({
    where: {
      hashedToken: oldToken?.hashedToken,
    },
    data: {
      revoked: true,
    },
  })

  const newTokens = generateTokens(user)
  const newRefreshToken: RefreshToken = await prisma.refreshToken.create({
    data: {
      hashedToken: newTokens.refreshToken,
      userId: user.id,
    },
  })

  res.cookie('jwt', newTokens.refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  })
  res.status(200).json({
    message: 'Refresh successful',
    data: {
      token: newTokens.accessToken,
    },
  })
}

export { handleLogin, handleRefreshToken }
