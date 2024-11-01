import { Role, type User } from '@prisma/client'
import { generateToken, generateTokens } from '../../utils/auth'
import { type JwtPayload, verify } from 'jsonwebtoken'

const testUser: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  username: 'john.doe',
  email: 'john.doe@email.com',
  password: 'hashedPassword',
  role: Role.ENTERPRISE,
  mfa: true,
  confirmed: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  stripeAccountId: 'testStripeAccountId'
}

describe('Auth utils test', () => {
  let publicKey: string
  let privateKey: string

  beforeEach(async () => {
    publicKey = process.env.PUBLIC_KEY as string
    privateKey = process.env.PUBLIC_KEY as string
  })

  test('Generate jwt token', async () => {
    const token = await generateToken(testUser, '5m')
    expect(token).toBeDefined()

    const decoded = verify(token, publicKey, {
      algorithms: ['RS256']
    }) as JwtPayload
    expect(decoded.username).toBe(testUser.username)
    expect(decoded.role).toBe(testUser.role)
    expect(decoded.iss).toBe(process.env.ISSUER)
  })

  test('Throw error when User is invalid', async () => {
    await expect(
      generateToken(undefined as unknown as User, '5m')
    ).rejects.toThrow('Invalid user object or expiration provided')
  })

  test('Generate jwt access and refresh tokens', async () => {
    const accessTokenExp = Math.floor(Date.now() / 1000) + 900 // 15 minutes
    const refreshTokenExp = Math.floor(Date.now() / 1000) + 28800 // 8 hours
    const { accessToken, refreshToken } = await generateTokens(testUser)
    expect(accessToken).toBeDefined()
    expect(refreshToken).toBeDefined()

    const decodedAccessToken = verify(accessToken, publicKey, {
      algorithms: ['RS256']
    }) as JwtPayload
    expect(decodedAccessToken.username).toBe(testUser.username)
    expect(decodedAccessToken.role).toBe(testUser.role)
    expect(decodedAccessToken.iss).toBe(process.env.ISSUER)
    expect(decodedAccessToken.exp).toBe(accessTokenExp)

    const decodedRefreshToken = verify(refreshToken, publicKey, {
      algorithms: ['RS256']
    }) as JwtPayload
    expect(decodedRefreshToken.username).toBe(testUser.username)
    expect(decodedRefreshToken.role).toBe(testUser.role)
    expect(decodedRefreshToken.iss).toBe(process.env.ISSUER)
    expect(decodedRefreshToken.exp).toBe(refreshTokenExp)
  })
})
