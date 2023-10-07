import { User } from '@prisma/client'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

function generateAccessToken(user: User): string {
  const payload: JwtPayload = { userId: user.id }
  const options: SignOptions = { expiresIn: '5m' }
  if (!process.env.JWT_REFRESH_SECRET)
    throw new Error('JWT_REFRESH_SECRET is not defined')

  const refreshToken: jwt.Secret = process.env.JWT_REFRESH_SECRET
  return jwt.sign(payload, refreshToken, options)
}

function generateRefreshToken(user: User, jti: string): string {
  const payload: JwtPayload = { userId: user.id, jti }
  const options: SignOptions = {
    expiresIn: '8h',
  }
  if (!process.env.JWT_REFRESH_SECRET)
    throw new Error('JWT_REFRESH_SECRET is not defined')

  const refreshToken: jwt.Secret = process.env.JWT_REFRESH_SECRET
  return jwt.sign(payload, refreshToken, options)
}

function generateTokens(
  user: User,
  jti: string
): { accessToken: string; refreshToken: string } {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user, jti)

  return {
    accessToken,
    refreshToken,
  }
}

export { generateAccessToken, generateRefreshToken, generateTokens }
