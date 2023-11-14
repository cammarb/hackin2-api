import { Request, Response, NextFunction } from 'express'
import fs from 'fs/promises'
import jwt from 'jsonwebtoken'
import { verifyJWT } from '../../src/middleware/auth.middelware'
import { generateKeyPairSync } from 'crypto'
import { generateAccessToken } from '../../src/config/auth'

jest.mock('fs/promises')
jest.mock('jsonwebtoken')

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

process.env.PUBKEY = publicKey
process.env.PRIVKEY = privateKey
process.env.ISSUER = 'exampleIssuer'

const user = {
  id: 1,
  firstName: 'Test',
  lastName: 'Testing',
  username: 'test.testing',
  email: 'test.testing@example.com',
  password: 'hashed-password',
  roleId: 1,
}

const accessToken = generateAccessToken(user)

describe('JWT Middleware Tests', () => {
  const mockRequest = {} as Request
  const mockResponse = {
    sendStatus: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response
  const mockNext = jest.fn() as unknown as NextFunction

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Should successfully verify JWT and set params on request', async () => {
    const mockDecoded = { username: 'Test', role: 1 }

    mockRequest.headers = { authorization: `Bearer ${accessToken}` }
    ;(fs.readFile as jest.Mock).mockResolvedValueOnce(process.env.PUBKEY)
    ;(jwt.verify as jest.Mock).mockReturnValueOnce(mockDecoded)

    await verifyJWT(mockRequest, mockResponse, mockNext)

    expect(fs.readFile).toHaveBeenCalledWith(`${process.env.PUBKEY}`, 'utf8')
    expect(jwt.verify).toHaveBeenCalledWith(accessToken, process.env.PUBKEY)
    expect(mockRequest.params.username).toBe(mockDecoded.username)
    expect(mockRequest.params.roleId).toBe(mockDecoded.role)
    expect(mockNext).toHaveBeenCalled()
    expect(mockResponse.sendStatus).not.toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })

  // test('Should return 401 if no authorization header is provided', async () => {
  //   await verifyJWT(mockRequest, mockResponse, mockNext)

  //   expect(mockResponse.sendStatus).toHaveBeenCalledWith(401)
  //   expect(mockNext).not.toHaveBeenCalled()
  //   expect(mockResponse.status).not.toHaveBeenCalled()
  //   expect(mockResponse.json).not.toHaveBeenCalled()
  // })

  // test('Should return 401 if secret is not found', async () => {
  //   const mockToken = 'mockToken'

  //   mockRequest.headers = { authorization: `Bearer ${mockToken}` }
  //   ;(fs.readFile as jest.Mock).mockResolvedValueOnce('')

  //   await verifyJWT(mockRequest, mockResponse, mockNext)

  //   expect(mockResponse.status).toHaveBeenCalledWith(401)
  //   expect(mockResponse.json).toHaveBeenCalledWith({
  //     error: 'Verification failed',
  //   })
  //   expect(mockNext).not.toHaveBeenCalled()
  //   expect(mockResponse.sendStatus).not.toHaveBeenCalled()
  // })

  test('Should return 403 if JWT verification fails', async () => {
    const mockToken = 'mockToken'
    const mockSecret = 'mockSecret'

    mockRequest.headers = { authorization: `Bearer ${mockToken}` }
    ;(fs.readFile as jest.Mock).mockResolvedValueOnce(mockSecret)
    ;(jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Verification failed')
    })

    await verifyJWT(mockRequest, mockResponse, mockNext)

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(403)
    expect(mockNext).not.toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
