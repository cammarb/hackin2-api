import { Request, Response } from 'express'
import {
  handleLogin,
  handleRefreshToken,
  handleRegistration,
} from '../../controllers/auth.controller'
import { Role } from '@prisma/client'
import { prismaMock } from '../__mocks__/prismaMock'
import { generateTokens } from '../../utils/auth'
import { getEnvs } from '../../utils/envs'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import redis from 'redis-mock'
import { createTransport } from 'nodemailer'
import { sendOTPEmail } from '../../utils/otp'
import prisma from '../../utils/client'

jest.mock('../../utils/auth', () => ({
  generateTokens: jest.fn().mockResolvedValue({
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
  }),
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
    otpPass: 'test password',
  }),
}))

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ username: 'username', role: 'role' }),
}))

jest.mock('../../utils/otp')
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockResolvedValue({
    sendMail: jest.fn().mockResolvedValue({
      from: 'test@email.com',
      to: 'test@email.com',
      subject: 'Hackin2 - Verification Code',
      text: `Your OTP code is: `,
    }),
  }),
}))

describe('handleRegistration function', () => {
  let req: Request | any
  let res: Response | any

  beforeEach(() => {
    req = {
      body: {
        username: 'testUsername',
        email: 'test@email.com',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        password: 'testPassword',
        role: Role.ENTERPRISE,
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    prisma.user.deleteMany()
    jest.clearAllMocks()
  })

  it('should handle existing user', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(req.body)

    await handleRegistration(req, res)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' })
  })

  it('should handle invalid input', async () => {
    const invalidReq = { body: {} } as Request

    await handleRegistration(invalidReq, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'All the fields are required',
    })
  })

  it('should handle invalid email', async () => {
    const invalidEmailReq = {
      body: { ...req.body, email: 'invalidEmail' },
    } as Request

    await handleRegistration(invalidEmailReq, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Enter a valid email' })
  })
})

describe('handleLogin function', () => {
  let req: Request | any
  let res: Response | any

  beforeEach(() => {
    req = {
      body: {
        username: 'testUsername',
        password: 'testPassword',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
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
    }

    const tokens = {
      accessToken: 'mockAccessToken',
      refreshToken: {
        id: '1',
        hashedToken: 'mockRefreshToken',
        userId: '1',
        revoked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(user)
    prismaMock.refreshToken.create.mockResolvedValueOnce(tokens.refreshToken)
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation((providedPassword, hashedPassword) => {
        return providedPassword === hashedPassword
      })

    await handleLogin(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      user: user.username,
      role: user.role,
      token: 'mockAccessToken',
    })
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'mockRefreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
  })

  it('should handle invalid input', async () => {
    const invalidReq = {
      body: { username: 123, password: 'testPassword' },
    } as Request

    await handleLogin(invalidReq, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: 'Both username and password are required',
    })
  })

  it('should handle invalid user', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null)

    await handleLogin(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication failed',
      message: 'Invalid username or password',
    })
  })

  it('should handle invalid password', async () => {
    jest.clearAllMocks()
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation((providedPassword, hashedPassword) => {
        return providedPassword !== hashedPassword
      })

    const userWithInvalidPassword = {
      ...req.body,
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(userWithInvalidPassword)

    await handleLogin(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication failed',
      message: 'Invalid username or password',
    })
  })
})

describe('handleRefreshToken', () => {
  let req: Request | any
  let res: Response | any

  beforeEach(() => {
    req = {
      cookies: {
        jwt: 'mockToken',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
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
    }
    const refreshToken = {
      id: '1',
      hashedToken: 'mockRefreshToken',
      userId: '1',
      revoked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const newTokens = {
      accessToken: {
        id: '1',
        hashedToken: 'mockAccessToken',
        userId: '1',
        revoked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      refreshToken: {
        id: '1',
        hashedToken: 'mockRefreshToken',
        userId: '1',
        revoked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(user)
    prismaMock.refreshToken.findUnique.mockResolvedValueOnce(refreshToken)
    prismaMock.refreshToken.update.mockResolvedValueOnce(refreshToken)
    prismaMock.refreshToken.create.mockResolvedValueOnce(newTokens.refreshToken)

    await handleRefreshToken(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      user: user.username,
      role: user.role,
      token: newTokens.accessToken.hashedToken,
    })
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'mockRefreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
  })
})
