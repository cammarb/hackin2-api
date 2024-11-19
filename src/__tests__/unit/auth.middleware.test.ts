import type { Request, Response, NextFunction } from 'express'
import { verifyJWT } from '../../auth/auth.middleware'
import { generateToken, generateTokens } from '../../utils/auth'
import { Role, type User } from '@prisma/client'
import {
  InvalidJWTError,
  JWTExpiredError,
  UnauthorizedError
} from '../../error/apiError'
import type { IncomingHttpHeaders } from 'node:http'

describe('verifyJWT middleware function', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

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

  beforeAll(async () => {
    tokens = await generateTokens(testUser)
    expiredToken = await generateToken(testUser, '0s')
  })

  beforeEach(async () => {
    req = {
      headers: {
        authorization:
          `Bearer ${tokens.accessToken}` as IncomingHttpHeaders['authorization']
      }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
  })

  test('Should verify the jwt token and call the next() funcition', async () => {
    await verifyJWT(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(req.username).toBe('john.doe')
    expect(req.role).toBe('ENTERPRISE')
  })

  test('Should throw error when jwt is missing in headers', async () => {
    req.headers = {
      authorization: undefined
    }

    await verifyJWT(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(
      new UnauthorizedError('Missing Authorization Headers')
    )
  })

  test('Should throw `JWTExpiredError` when jwt is expired', async () => {
    req.headers = { authorization: `Bearer ${expiredToken}` }

    await verifyJWT(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(new JWTExpiredError('jwt expired'))
  })

  test('Should throw `InvalidJWTError` when jwt is invalid', async () => {
    req.headers = { authorization: `Bearer invalid${expiredToken}` }

    await verifyJWT(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(new InvalidJWTError('invalid token'))
  })
})
