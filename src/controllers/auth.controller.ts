import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../utils/client'
import { RefreshToken, User } from '@prisma/client'
import { generateTokens } from '../utils/auth'
import jwt, { JwtPayload } from 'jsonwebtoken'
import fs from 'fs'
import * as EmailValidator from 'email-validator'
import hashToken from '../utils/hash'
import { getEnvs } from '../utils/envs'
import { generateOTP, sendOTPEmail } from '../utils/otp'
import { redisClient } from '../utils/redis'

export const handleRegistration = async (req: Request, res: Response) => {
  const { username, email, firstName, lastName, password, role } = req.body
  if (!username || !password || !email || !firstName || !lastName || !role)
    return res.status(400).json({ message: 'All the fields are required' })

  if (!EmailValidator.validate(email))
    return res.status(400).json({ message: 'Enter a valid email' })

  try {
    const existingUser: User | null = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    })
    if (existingUser)
      return res.status(409).json({ message: 'User already exists' })

    const hashedPassword = await hashToken(password)
    const otp = generateOTP()
    const user: User = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: hashedPassword,
        role: role,
      },
    })
    await sendOTPEmail(email, otp)
    await redisClient.set(email, otp, { EX: 300 })
    res.status(201).json({ success: 'User created successfully' })
  } catch (err: Error | any) {
    console.error(err)
    res.status(500).json({ message: err?.message })
  }
}

const handleLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (
      !username ||
      !password ||
      typeof username !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Both username and password are required',
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password',
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password',
      })
    }

    const tokens = await generateTokens(user)

    const refreshToken = await prisma.refreshToken.create({
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

    return res.status(200).json({
      user: user.username,
      role: user.role,
      token: tokens.accessToken,
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    })
  }
}

const handleRefreshToken = async (req: Request, res: Response) => {
  const jwtCookie = req.cookies['jwt']

  const { publicKey } = await getEnvs()

  if (!jwtCookie || !publicKey)
    return res.status(401).json({ message: 'Unauthorized' })

  const decoded: JwtPayload = jwt.verify(jwtCookie, publicKey) as JwtPayload

  if (!decoded) return res.sendStatus(401)

  const user: User | null = await prisma.user.findUnique({
    where: {
      username: decoded.username,
    },
  })
  if (!user) return res.sendStatus(401) // Unauthorized

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
  try {
    const newTokens = await generateTokens(user)
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
      user: user.username,
      role: user.role,
      token: `${newTokens.accessToken}`,
    })
  } catch (error) {
    console.log(error)
  }
}

const handleLogOut = async (req: Request, res: Response) => {
  const jwtCookie = req.cookies['jwt']
  const jwtHeader = req.headers['authorization']

  if (!jwtCookie || !jwtHeader) {
    return res.sendStatus(204)
  }

  try {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    res.removeHeader('authorization')
    const token = await prisma.refreshToken.updateMany({
      where: {
        hashedToken: jwtCookie,
      },
      data: {
        revoked: true,
      },
    })
    return res.status(200).json({ message: 'Log Out successful.' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

const validateOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' })
  }

  try {
    const cachedOTP = await redisClient.get(email)

    if (cachedOTP !== otp || cachedOTP == null) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    await redisClient.del(email)
    const user: User = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        confirmed: true,
      },
    })

    res.status(200).json({ success: 'OTP validated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal Sever Error' })
  }
}

export { handleLogin, handleRefreshToken, handleLogOut, validateOTP }
