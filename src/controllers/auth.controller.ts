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
    if (passwordMatch) {
      const tokens = generateTokens(user)
      const refreshToken: RefreshToken = await prisma.refreshToken.create({
        data: {
          hashedToken: tokens.refreshToken,
          userId: user.id,
        },
      })
      res.header('Authorization', `Bearer ${tokens.accessToken}`)
      res.cookie('Refresh-Token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })

      res.status(200).json({
        message: 'Login successful',
      })
    } else {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password',
      })
    }
  }
}

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
      if (err || !decoded) {
        return res.sendStatus(403)
      }

      const accessToken = generateAccessToken(user)
      res.json({ accessToken })
    })
  }
}

export { handleLogin, handleRefreshToken }
