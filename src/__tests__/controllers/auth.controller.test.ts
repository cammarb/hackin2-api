import { Request, Response } from 'express'
import { prismaMock } from '../../../singleton'
import { Role } from '@prisma/client'
import {
  handleLogin,
  handleRegistration,
} from '../../controllers/auth.controller'
import bcrypt from 'bcrypt'
import hashToken from '../../utils/hash'

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

  it('should handle internal server error', async () => {
    prismaMock.user.findFirst.mockRejectedValueOnce(
      new Error('Internal Server Error'),
    )

    await handleRegistration(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' })
  })

  it('should create a new user', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null)
    prismaMock.user.create.mockResolvedValueOnce(req.body)

    await handleRegistration(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      success: 'User created successfully',
    })
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
    const userWithInvalidPassword = {
      ...req.body,
      password: 'invalidPassword',
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(userWithInvalidPassword)

    await handleLogin(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication failed',
      message: 'Invalid username or password',
    })
  })

  it('should handle valid user', async () => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = {
      ...req.body,
      password: hashedPassword,
    }

    const tokens = {
      accessToken: '12345',
      refreshToken: {
        id: '1',
        hashedToken: 'token',
        userId: 'testUserId',
        revoked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(user)
    prismaMock.refreshToken.create.mockResolvedValueOnce(tokens.refreshToken)

    await handleLogin(req, res)

    expect(res.cookie).toHaveReturned()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalled()
  })
})
