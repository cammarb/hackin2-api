import { User } from '@prisma/client'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import fs from 'fs'
import { privateKey } from '../app'

const generateAccessToken = (user: User): string => {
  const payload: JwtPayload = {
    username: user.username,
    role: user.roleId,
  }
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '30s',
    issuer: process.env.ISSUER,
  }

  const accessSecret: jwt.Secret = privateKey

  return jwt.sign(payload, accessSecret, options)
}

const generateRefreshToken = (user: User): string => {
  const payload: JwtPayload = { username: user.username, role: user.roleId }
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '8h',
    issuer: process.env.ISSUER,
  }

  const refreshSecret: jwt.Secret = privateKey

  return jwt.sign(payload, refreshSecret, options)
}

const generateTokens = (
  user: User
): { accessToken: string; refreshToken: string } => {
  if (!process.env.PRIVKEY || !process.env.ISSUER)
    throw new Error('secretOrPrivateKey must have a value')

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return {
    accessToken,
    refreshToken,
  }
}

export { generateAccessToken, generateRefreshToken, generateTokens }
