import type { User } from '@prisma/client'
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'

const generateToken = async (
  user: User,
  expiration: SignOptions['expiresIn']
): Promise<string> => {
  if (!user || !expiration) {
    throw new Error('Invalid user object or expiration provided')
  }
  try {
    const payload: JwtPayload = {
      username: user.username,
      role: user.role
    }

    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn: expiration,
      issuer: process.env.ISSUER
    }
    return jwt.sign(payload, process.env.PRIVATE_KEY, options)
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
    const accessToken = await generateToken(user, '15m')
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
