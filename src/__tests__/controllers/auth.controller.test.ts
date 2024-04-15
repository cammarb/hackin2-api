import { Request, Response } from 'express'
import {
  handleLogin,
  handleRegistration,
} from '../../controllers/auth.controller'
import { Role } from '@prisma/client'
import { prismaMock } from '../../../singleton'
import { generateTokens } from '../../utils/auth'
import getEnvs from '../../utils/envs'
import bcrypt from 'bcrypt'

jest.mock('../../utils/auth', () => ({
  generateTokens: jest.fn().mockResolvedValue({
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
  }),
}))

jest.mock('../../utils/envs', () => ({
  getEnvs: jest.fn().mockResolvedValue({
    port: 'fakePort',
    privateKey: 'fakePrivateKey',
    publicKey: 'fakePublicKey',
    issuer: 'fakeIssuer',
    origin: 'fakeOrigin',
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

// describe('handleLogin', () => {
//   let req: Request | any
//   let res: Response | any

//   beforeEach(() => {
//     req = {
//       body: {
//         username: 'testUsername',
//         password: 'testPassword',
//       },
//     }
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//       cookie: jest.fn(),
//     }
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })
// })
