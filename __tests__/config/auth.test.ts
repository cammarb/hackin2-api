import { generateTokens } from '../../src/config/auth'
import fs from 'fs'
import { User } from '@prisma/client'

jest.mock('fs')

describe('generateTokens', () => {
  test('Should generate the tokens with valid private key', () => {
    ;(fs.readFileSync as jest.Mock).mockReturnValue('valid-private-key')

    const user: User = {
      id: 1,
      firstName: 'Test',
      lastName: 'Testing',
      username: 'test.testing',
      email: 'test.testing@example.com',
      password: 'hashed-password',
      roleId: 1,
    }
    const tokens = generateTokens(user)

    const accessToken = tokens.accessToken
    const refreshToken = tokens.refreshToken

    expect(typeof accessToken).toBe('string')
    expect(accessToken.length).toBeGreaterThan(0)

    expect(typeof refreshToken).toBe('string')
    expect(refreshToken.length).toBeGreaterThan(0)
  })
})
