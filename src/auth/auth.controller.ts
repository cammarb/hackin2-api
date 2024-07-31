import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import prisma from '../utils/client'
import { User } from '@prisma/client'
import { generateTokens } from '../utils/auth'
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from 'jsonwebtoken'
import hashToken from '../utils/hash'
import { getEnvs } from '../utils/envs'
import { redisClient } from '../utils/redis'
import { generateOTP, sendOTPEmail } from '../utils/otp'
import { createUser } from '../user/user.service'
import { validateEmail } from '../utils/emailValidator'
import { LoginUserBody, NewUserBody } from '../user/user.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import {
  BadRequestError,
  ConflictError,
  InvalidJWTError,
  JWTExpiredError,
  MissingBodyParameterError,
} from '../error/apiError'
import { loginService, refreshTokenCycleService } from './auth.service'

export const registrationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as NewUserBody
    await validateEmail(body.email)

    body.password = await hashToken(body.password)
    const otp = generateOTP()
    const user: User = await createUser(body)
    await sendOTPEmail(user.email, otp)
    await redisClient.set(user.email, otp, { EX: 300 })
    return res.status(201).json({ success: 'User created successfully' })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002')
        next(new ConflictError('Unique constraint violation'))
    } else next(err)
  }
}

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as LoginUserBody

    const user = await loginService(body)

    const tokens = await generateTokens(user)

    const refreshToken = await prisma.refreshToken.create({
      data: {
        hashedToken: tokens.refreshToken,
        userId: user.id,
      },
    })

    req.session.user = {
      logged_in: true,
      id: user.id,
      username: user.username,
      role: user.role,
    } as SessionData['user']

    res.cookie('jwt', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.status(200).json({
      user: user.username,
      role: user.role,
      token: tokens.accessToken,
    })
  } catch (error) {
    next(error)
  }
}

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jwtCookie: string = req.cookies['jwt']

    const { publicKey } = await getEnvs()

    const decoded: JwtPayload = jwt.verify(jwtCookie, publicKey) as JwtPayload

    if (!decoded) return res.sendStatus(401)

    const user: User | null = await prisma.user.findUnique({
      where: {
        username: decoded.username,
      },
    })
    if (!user) return res.sendStatus(401)

    const newTokens = await refreshTokenCycleService(jwtCookie, user)

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
    if (error instanceof TokenExpiredError) {
      next(new JWTExpiredError(error.message))
    } else if (error instanceof JsonWebTokenError) {
      next(new InvalidJWTError(error.message))
    } else {
      next(error)
    }
  }
}

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jwtCookie = req.cookies['jwt']
    const jwtHeader = req.headers['authorization']

    if (!jwtCookie || !jwtHeader) {
      return res.sendStatus(204)
    }

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

    req.session.destroy((err: Error) => {
      if (err) {
        throw new Error()
      }
      res.clearCookie('connect.sid')
      return res.status(204)
    })
  } catch (error) {
    next(error)
  }
}

export const sessionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = req.session
    if (!session) return res.sendStatus(401)

    const sessionData: string | null = await redisClient.get(
      'hackin2-api:' + session.id,
    )
    if (!sessionData) res.sendStatus(403)
    else {
      const parsedSession = JSON.parse(sessionData)
      return res.status(200).json({
        user: parsedSession.user.username,
        role: parsedSession.user.role,
      })
    }
  } catch (error) {
    next(error)
  }
}

export const validateOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) throw new MissingBodyParameterError('email, body')

    const cachedOTP = await redisClient.get(email)

    if (cachedOTP !== otp || cachedOTP == null)
      throw new BadRequestError('Invalid OTP')

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
    next(err)
  }
}
