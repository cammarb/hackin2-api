import type { User } from '@prisma/client'
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { getEnvs } from './envs'

const generateToken = async (
  user: User,
  expiration: SignOptions['expiresIn']
): Promise<string> => {
  if (!user || !expiration) {
    throw new Error('Invalid user object or expiration provided')
  }
  try {
    const { issuer, privateKey } = await getEnvs()

    const payload: JwtPayload = {
      username: user.username,
      role: user.role
    }

    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn: expiration,
      issuer: issuer
    }

    return jwt.sign(payload, privateKey, options)
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Failed to generate token')
  }
}

const generateTokens = async (
  user: User
): Promise<{ accessToken: string; refreshToken: string }> => {
  if (!user) {
    throw new Error('Invalid user object provided')
  }
  try {
    const accessToken = await generateToken(user, '5m')
    const refreshToken = await generateToken(user, '8h')

    return {
      accessToken,
      refreshToken
    }
  } catch (error) {
    throw new Error('Failed to generate tokens')
  }
}

export { generateToken, generateTokens }
