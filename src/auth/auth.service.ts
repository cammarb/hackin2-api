import type { RefreshToken, User } from '@prisma/client'
import { compare } from 'bcrypt'
import { AuthenticationError } from '../error/apiError'
import type { LoginUserBody } from '../user/user.dto'
import { generateTokens } from '../utils/auth'
import prisma from '../utils/client'

export const loginService = async (body: LoginUserBody) => {
  const { username, password } = body

  const user = await prisma.user.findUnique({
    where: {
      username: username
    },
    include: {
      CompanyMember: {
        select: {
          companyId: true,
          companyRole: true
        }
      }
    }
  })

  if (!user) throw new AuthenticationError()

  const isValidPassword = await compare(password, user.password)
  if (!isValidPassword) throw new AuthenticationError()

  return user
}

/**
 * Manages the cycle of revoking current refreshToken and creating a new one
 *
 * @returns new `accessToken` and `refreshToken`
 */
export const refreshTokenCycleService = async (token: string, user: User) => {
  const [revokeToken, newTokens] = await Promise.all([
    prisma.refreshToken.update({
      where: {
        hashedToken: token
      },
      data: {
        revoked: true
      }
    }),
    generateTokens(user)
  ])

  const newRefreshToken: RefreshToken = await prisma.refreshToken.create({
    data: {
      hashedToken: newTokens.refreshToken,
      userId: user.id
    }
  })

  return newTokens
}
