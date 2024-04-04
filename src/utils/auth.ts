import { User } from '@prisma/client'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import getEnvs from './envs'

const generateToken = async (
  user: User,
  expiration: SignOptions['expiresIn'],
): Promise<string> => {
  const { issuer, privateKey } = await getEnvs()

  const payload: JwtPayload = {
    username: user.username,
    role: user.role,
  }

  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: expiration,
    issuer: issuer,
  }

  return jwt.sign(payload, privateKey, options)
}

const generateTokens = async (
  user: User,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = await generateToken(user, '5m')
  const refreshToken = await generateToken(user, '8h')

  return {
    accessToken,
    refreshToken,
  }
}

export { generateTokens }
