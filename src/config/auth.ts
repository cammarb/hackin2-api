import { User } from '@prisma/client'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import fs from 'fs'
import { issuer, privateKey } from '../app'

const generateAccessToken = (user: User): string => {
  const payload: JwtPayload = {
    username: user.username,
    role: user.roleId,
  }
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '5m',
    issuer: issuer,
  }

  const accessSecret: jwt.Secret = privateKey

  return jwt.sign(payload, accessSecret, options)
}

const generateRefreshToken = (user: User): string => {
  const payload: JwtPayload = { username: user.username, role: user.roleId }
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '8h',
    issuer: issuer,
  }

  const refreshSecret: jwt.Secret = privateKey

  return jwt.sign(payload, refreshSecret, options)
}

const generateTokens = (
  user: User
): { accessToken: string; refreshToken: string } => {
  if (!privateKey || !issuer)
    throw new Error('secretOrPrivateKey must have a value')

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return {
    accessToken,
    refreshToken,
  }
}

export { generateAccessToken, generateRefreshToken, generateTokens }
