import { User } from '@prisma/client'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

const generateAccessToken = (user: User): string => {
  const payload: JwtPayload = {
    username: user.username,
    role: user.roleId,
  }
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '5m',
    issuer: 'https://hackin2.com',
  }

  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error('ACCESS_TOKEN_SECRET is not defined')

  const accessSecret: jwt.Secret = process.env.ACCESS_TOKEN_SECRET

  return jwt.sign(payload, accessSecret, options)
}

const generateRefreshToken = (user: User): string => {
  const payload: JwtPayload = { username: user.username, role: user.roleId }
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '8h',
    issuer: 'https://hackin2.com',
  }

  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new Error('REFRESH_TOKEN_SECRET is not defined')

  const refreshToken: jwt.Secret = process.env.REFRESH_TOKEN_SECRET

  return jwt.sign(payload, refreshToken, options)
}

const generateTokens = (
  user: User
): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return {
    accessToken,
    refreshToken,
  }
}

export { generateAccessToken, generateRefreshToken, generateTokens }
