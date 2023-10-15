import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../config/db'
import { RefreshToken, User } from '@prisma/client'
import { generateTokens } from '../config/auth'

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
      res.header('Refresh-Token', tokens.refreshToken)

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

export { handleLogin }
