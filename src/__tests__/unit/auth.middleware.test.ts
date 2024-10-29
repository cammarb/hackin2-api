import type { Request, Response, NextFunction } from 'express'
import { verifyJWT } from '../../auth/auth.middleware'
import { generateToken, generateTokens } from '../../utils/auth'
import { Role, type User } from '@prisma/client'
import {
  InvalidJWTError,
  JWTExpiredError,
  UnauthorizedError
} from '../../error/apiError'

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
