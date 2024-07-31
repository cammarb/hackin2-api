import { RefreshToken, User } from '@prisma/client'
import { ResourceNotFoundError } from '../error/apiError'
import { LoginUserBody } from '../user/user.dto'
import { generateTokens } from '../utils/auth'
import prisma from '../utils/client'
import { compare } from 'bcrypt'

export const loginService = async (body: LoginUserBody) => {
  const { username, password } = body

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })

  if (!user) throw new ResourceNotFoundError()

  await compare(password, password)

  return user
}

/**
 * Manages the cycle of revoking current refreshToken and creating a new one
 *
 * @returns new `accessToken` and `refreshToken`
 */
export const refreshTokenCycleService = async (token: string, user: User) => {
  const revokeToken = await prisma.refreshToken.update({
    where: {
      hashedToken: token,
    },
    data: {
      revoked: true,
    },
  })

  const newTokens = await generateTokens(user)
  const newRefreshToken: RefreshToken = await prisma.refreshToken.create({
    data: {
      hashedToken: newTokens.refreshToken,
      userId: user.id,
    },
  })

  return newTokens
}
