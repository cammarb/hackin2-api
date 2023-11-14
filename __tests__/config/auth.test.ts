import { issuer, privateKey } from '../../src/app'
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
} from '../../src/config/auth'
import { User } from '@prisma/client'

const user: User = {
  id: 1,
  firstName: 'Test',
  lastName: 'Testing',
  username: 'test.testing',
  email: 'test.testing@example.com',
  password: 'hashed-password',
  roleId: 1,
}

describe('generateAccessToken', () => {
  test('Should generate the Access Token with valid private key', () => {
    const accessToken = generateAccessToken(user)

    expect(typeof accessToken).toBe('string')
    expect(accessToken.length).toBeGreaterThan(0)
  })
})

describe('generateRefreshToken', () => {
  test('Should generate the Refresh Token with valid private key', () => {
    const refreshToken = generateRefreshToken(user)

    expect(typeof refreshToken).toBe('string')
    expect(refreshToken.length).toBeGreaterThan(0)
  })
})

describe('generateToken', () => {
  test('Should generate the Tokens with valid private key', () => {
    const { accessToken, refreshToken } = generateTokens(user)

    expect(typeof accessToken).toBe('string')
    expect(accessToken.length).toBeGreaterThan(0)

    expect(typeof refreshToken).toBe('string')
    expect(refreshToken.length).toBeGreaterThan(0)
  })
  test('Throws an error if key or issuer is not defined', () => {
    issuer === ''
    privateKey === ''

    expect(() => generateTokens(user)).toThrow(
      'secretOrPrivateKey must have a value'
    )
  })
})
