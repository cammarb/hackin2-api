import { generateTokens } from '../../src/config/auth'
import fs from 'fs'
import { User } from '@prisma/client'
import { generateKeyPairSync } from 'crypto'

jest.mock('fs')

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
})

process.env.PRIVKEY = privateKey
process.env.ISSUER = 'exampleIssuer'

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
  test('Should generate the tokens with valid private key', () => {
    ;(fs.readFileSync as jest.Mock).mockReturnValue(process.env.PRIVKEY)

    const tokens = generateTokens(user)

    const accessToken = tokens.accessToken
    const refreshToken = tokens.refreshToken

    expect(typeof accessToken).toBe('string')
    expect(accessToken.length).toBeGreaterThan(0)

    expect(typeof refreshToken).toBe('string')
    expect(refreshToken.length).toBeGreaterThan(0)
  })
})

describe('generateTokens', () => {
  test('Should generate the tokens with valid private key', () => {
    ;(fs.readFileSync as jest.Mock).mockReturnValue(process.env.PRIVKEY)

    const tokens = generateTokens(user)

    const accessToken = tokens.accessToken
    const refreshToken = tokens.refreshToken

    expect(typeof accessToken).toBe('string')
    expect(accessToken.length).toBeGreaterThan(0)

    expect(typeof refreshToken).toBe('string')
    expect(refreshToken.length).toBeGreaterThan(0)
  })
})
