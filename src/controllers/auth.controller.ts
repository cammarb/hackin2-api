import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../config/db'
import { RefreshToken, User } from '@prisma/client'
import { generateAccessToken, generateTokens } from '../config/auth'
import jwt from 'jsonwebtoken'

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
        data: `${tokens.accessToken}`,
      })
    }
  }
}

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookie = req.cookies
  if (!cookie?.jwt) return res.status(401).json({ message: 'Unauthorized' })

  const refreshToken = cookie.jwt

  const tokenSecretKey = process.env.SECRET_KEY
  const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY

  if (!tokenSecretKey || !refreshTokenSecretKey) {
    return res.sendStatus(403)
  } else {
    const decoded = jwt.verify(refreshToken, refreshTokenSecretKey)
    if (!decoded) return res.sendStatus(403)

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

    // revoke old refreshToken and add new refreshToken to db
    const oldToken = await prisma.refreshToken.findUnique({
      where: {
        hashedToken: refreshToken,
      },
    })
    const updatedToken = await prisma.refreshToken.update({
      where: {
        id: oldToken?.id,
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
    res.json({ data: newTokens.accessToken })
  }
}

export { handleLogin, handleRefreshToken }
