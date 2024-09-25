import type { Request, Response, NextFunction } from 'express'
import { getEnvs } from '../../utils/envs'
import { verifyJWT } from '../../auth/auth.middleware'
import { generateToken, generateTokens } from '../../utils/auth'
import { Role, type User } from '@prisma/client'
import {
  InvalidJWTError,
  JWTExpiredError,
  UnauthorizedError
} from '../../error/apiError'

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDgZVRy0KtHKxv1
PfFg7sBCSyCX5Ia4hUsWZOCiq2w0V2TD/BdISLPeeF6ZBcoLGVNtYPPzva/CFaMN
4QR/ZYmUzON+uzeSn3LJWGHrMkmmzxN2Oa1N3VeMKP9BV1XZHIy8HVLLhUAuXTKH
9ZdJDf69i3tCA12KznmDYqscYMGGEFWG0XvMPVUdnX3xHE8GtMtQyengJ8U4xwdR
o6H4zq56QcpvSqK/XfREtz/ohF/Y4fbemoFev/LMH6Yru50o7EZXYiiBlyNs1Ard
GpZHxlygahlxWAmZq34S1VcYH5qaLo9g0NDJEJ0ACOb0YuUGuCSgmtUB4Jvyo6UY
Ivhy7gEZAgMBAAECggEAQ3ZTYD1Z8QiF3EImKoU86fFaODAtTJZOT8o+Osmcu1O2
6LEGcuXgpba8gfbammGf0ld+oD3b9Fa68bY/uulU5pZ+oqA4ge1L/jqDHcm9mNfS
uw12C93Kr0m4C/Xsylwp93g9ZxCFjirYwUVVmVIKzwN7KAqI+e0/XP+x/9Ma+2mn
mWWJgMb+kn9KFiO5P5FQbHlYW4wTLL3kmd6FjcSi0T3aYW8cWyRMUDLQDiwp7Xyz
vEv0SMX4AeeE6BD0F0+gQc9qDHwr2H5/WtKGHvnRYmiJ8zSKnBXpg0BHWw0GFN3a
3GqZ9oYi+bj1gjFt1ZKlVv8uuJevPjn5IjOmZvJULQKBgQD0CjhCm/IvrGT9LuhL
PAaHRSKg/gb2VEbt3zuYfbf5Ksl16gcImf2T+1SnNLNY3/tTK41PMYbcjfEIv2xi
fytgQ0szRTnzNvCypXBLv1cG9wBNuboi56n4s8JfJyfghki1nVc69/5j/jDNvrPb
SwGFqZmNXocWEOsPXrHG/kUGfwKBgQDrZKaYLQ1E8ZsV+h1CVgJ/yjKwLbp+CjR9
Lw/3IYnytCTHBg6HV4iipe6oOqrdm3XiP1p4ci+uzsYTftAx8P9ch4ycZC89sEOf
0UGiOpT7xgz7hYkdZoXsn8tvOaiFKKylb/1ANFyqb/x2dUWjjoSFc4xwHTE4kymy
Xx42X02cZwKBgBm4NgO3IcgqeB5C4lKDigCZpbOn8h3l9e+99i71GP2Wp9LYjlM2
v4XoGBzjLf+w43D5hxQQmTEHeJ6+ZfLfijfD/9nwctISOT3qt7IUAV0HjS2j5F0n
Yz+F2ndizg4YuPMDGR1q45GwSX51mckD1645mKhQjRYjRFLDXSMmyymLAoGBAM41
ykudi/ZNwZKrHV6zglT4iRcVuD4aKolP5SiV1QctENrZT3j5EdWKj1wIqQ6h1c9x
uIuzXFpDAfqqKTDW8p3YkTGgAlKES3mCE4FO2J0Hju/4t3luCvyTr9+sHxkn3LbB
OJY6SMN2fzA24964RxexdeHxcOEi6nA8K3duXcsZAoGBAMKrWh6wL7Jd+32HKzYS
JYo38HJfawL7LSNCcLOqlk4U0JNwpFFdG1nHUL9GMBJXPgBbh40v49eWBXRLe6/f
TTTyjsrUI84gJqZUyknk0HC3HvPrOs0CH+YcZj4Okk9WehMlfXoO2gccxLkHQiAP
mUgkXKRS2dkdzAg2THDx/pOU
-----END PRIVATE KEY-----`

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4GVUctCrRysb9T3xYO7A
Qksgl+SGuIVLFmTgoqtsNFdkw/wXSEiz3nhemQXKCxlTbWDz872vwhWjDeEEf2WJ
lMzjfrs3kp9yyVhh6zJJps8TdjmtTd1XjCj/QVdV2RyMvB1Sy4VALl0yh/WXSQ3+
vYt7QgNdis55g2KrHGDBhhBVhtF7zD1VHZ198RxPBrTLUMnp4CfFOMcHUaOh+M6u
ekHKb0qiv130RLc/6IRf2OH23pqBXr/yzB+mK7udKOxGV2IogZcjbNQK3RqWR8Zc
oGoZcVgJmat+EtVXGB+ami6PYNDQyRCdAAjm9GLlBrgkoJrVAeCb8qOlGCL4cu4B
GQIDAQAB
-----END PUBLIC KEY-----`

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
  updatedAt: new Date()
}

jest.mock('../../utils/envs', () => ({
  getEnvs: jest.fn()
}))

let tokens = {
  accessToken: '',
  refreshToken: ''
}

let expiredToken = ''

describe('verifyJWT middleware function', () => {
  let req: Request | any
  let res: Response | any
  let next: NextFunction
  beforeAll(async () => {
    const envs = getEnvs as jest.Mock
    envs.mockResolvedValue({
      privateKey,
      publicKey,
      issuer: 'www.example.com',
      origin: 'www.example.com',
      port: '3000',
      otpService: 'test email',
      otpUser: 'user@test.com',
      otpPass: 'test password'
    })

    tokens = await generateTokens(testUser)
    expiredToken = await generateToken(testUser, '0s')
  })

  beforeEach(async () => {
    req = {
      headers: {
        authorization: `Bearer ${tokens.accessToken}`
      }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
  })

  test('Should verify the jwt token and call the next() funcition', async () => {
    await verifyJWT(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.username).toBe('john.doe')
    expect(req.role).toBe('ENTERPRISE')
  })

  test('Should throw error when jwt is missing in headers', async () => {
    req.headers = {}
    try {
      await verifyJWT(req, res, next)
    } catch (error) {
      expect(next).toHaveBeenCalledWith(
        new UnauthorizedError('Missing Authorization Headers')
      )
    }
  })

  test('Should throw `JWTExpiredError` when jwt is expired', async () => {
    req.headers.authorization = `Bearer ${expiredToken}`
    try {
      await verifyJWT(req, res, next)
    } catch (error) {
      expect(next).toHaveBeenCalledWith(new JWTExpiredError('jwt expired'))
    }
  })

  test('Should throw `InvalidJWTError` when jwt is invalid', async () => {
    req.headers.authorization = `Bearer invalid${expiredToken}`
    try {
      await verifyJWT(req, res, next)
    } catch (error) {
      expect(next).toHaveBeenCalledWith(new InvalidJWTError('invalid token'))
    }
  })
})
