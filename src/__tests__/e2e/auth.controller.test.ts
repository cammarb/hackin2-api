import { Role } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { NextFunction, Request, Response } from 'express'
import {
  loginController,
  refreshTokenController,
  registrationController
} from '../../auth/auth.controller'
import {
  AuthenticationError,
  InvalidParameterError,
  ResourceNotFoundError
} from '../../error/apiError'
import prisma from '../../utils/client'
import { prismaMock } from '../__mocks__/prismaMock'

jest.mock('../../utils/auth', () => ({
  generateTokens: jest.fn().mockResolvedValue({
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken'
  })
}))

jest.mock('../../utils/envs', () => ({
  getEnvs: jest.fn().mockResolvedValue({
    privateKey: 'fakePrivateKey',
    publicKey: 'fakePublicKey',
    issuer: 'www.example.com',
    origin: 'www.example.com',
    port: '3000',
    otpService: 'test email',
    otpUser: 'user@test.com',
    otpPass: 'test password'
  })
}))

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ username: 'username', role: 'role' })
}))

jest.mock('../../utils/otp')
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockResolvedValue({
    sendMail: jest.fn().mockResolvedValue({
      from: 'test@email.com',
      to: 'test@email.com',
      subject: 'Hackin2 - Verification Code',
      text: 'Your OTP code is: '
    })
  })
}))

describe('handleRegistration function', () => {
  let req: Request | any
  let res: Response | any
  let next: NextFunction

  beforeEach(() => {
    req = {
      body: {
        username: 'testUsername',
        email: 'test@email.com',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        password: 'testPassword',
        role: Role.ENTERPRISE
      }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
  })

  afterEach(() => {
    prisma.user.deleteMany()
    jest.clearAllMocks()
  })

  it('should handle invalid email', async () => {
    req = {
      body: { ...req.body, email: 'invalidEmail' }
    } as Request

    await registrationController(req, res, next)

    expect(next).toHaveBeenCalledWith(new InvalidParameterError(req.body.email))
  })
})

describe('handleLogin function', () => {
  let req: Request | any
  let res: Response | any
  let next: NextFunction
  let bcryptCompare: jest.SpyInstance

  beforeEach(() => {
    req = {
      body: {
        username: 'testUsername',
        password: 'testPassword'
      },
      session: {
        user: {}
      }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    }
    next = jest.fn()

    bcryptCompare = jest.spyOn(bcrypt, 'compare')
  })

  afterEach(() => {
    jest.clearAllMocks()
    bcryptCompare.mockRestore()
  })

  test('should handle valid user', async () => {
    const user = {
      id: '1',
      username: 'testUsername',
      email: 'test@email.com',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      password: 'testPassword',
      role: Role.ENTERPRISE,
      mfa: false,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeAccountId: 'testStripeAccountId'
    }

    const tokens = {
      accessToken: 'mockAccessToken',
      refreshToken: {
        id: '1',
        hashedToken: 'mockRefreshToken',
        userId: '1',
        revoked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(user)
    prismaMock.refreshToken.create.mockResolvedValueOnce(tokens.refreshToken)
    bcryptCompare.mockImplementation((providedPassword, hashedPassword) => {
      return providedPassword === hashedPassword
    })

    await loginController(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        token: tokens.accessToken,
        company: {
          id: undefined,
          role: undefined
        }
      }
    })
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'mockRefreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })
  })

  it('should handle invalid input', async () => {
    const invalidReq = {
      body: { username: 123, password: 'testPassword' }
    } as Request

    await loginController(invalidReq, res, next)

    expect(next).toHaveBeenCalledWith(new AuthenticationError())
  })

  it('should handle invalid user', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null)

    await loginController(req, res, next)

    expect(next).toHaveBeenCalledWith(new AuthenticationError())
  })

  it('should handle invalid password', async () => {
    const user = {
      id: '1',
      username: 'testUsername',
      email: 'test@email.com',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      password: 'rightPassword',
      role: Role.ENTERPRISE,
      mfa: false,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeAccountId: 'testStripeAccountId'
    }

    bcryptCompare.mockResolvedValue(false)

    prismaMock.user.findUnique.mockResolvedValueOnce(user)

    await loginController(req, res, next)

    expect(next).toHaveBeenCalledWith(new AuthenticationError())
  })
})

describe('handleRefreshToken', () => {
  let req: Request | any
  let res: Response | any
  let next: NextFunction

  beforeEach(() => {
    req = {
      cookies: {
        jwt: 'mockToken'
      }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should return a new accessToken and refreshToken', async () => {
    const user = {
      id: '1',
      username: 'testUsername',
      email: 'test@email.com',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      password: 'testPassword',
      role: Role.ENTERPRISE,
      mfa: false,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeAccountId: 'testStripeAccountId'
    }
    const refreshToken = {
      id: '1',
      hashedToken: 'mockRefreshToken',
      userId: '1',
      revoked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const newTokens = {
      accessToken: {
        id: '1',
        hashedToken: 'mockAccessToken',
        userId: '1',
        revoked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      refreshToken: {
        id: '1',
        hashedToken: 'mockRefreshToken',
        userId: '1',
        revoked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(user)
    prismaMock.refreshToken.findUnique.mockResolvedValueOnce(refreshToken)
    prismaMock.refreshToken.update.mockResolvedValueOnce(refreshToken)
    prismaMock.refreshToken.create.mockResolvedValueOnce(newTokens.refreshToken)

    await refreshTokenController(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        token: newTokens.accessToken.hashedToken,
        company: {
          id: undefined,
          role: undefined
        }
      }
    })
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'mockRefreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })
  })
})
