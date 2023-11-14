import { Request, Response, NextFunction } from 'express'
import fs from 'fs/promises'
import jwt from 'jsonwebtoken'
import { verifyJWT } from '../../src/middleware/auth.middleware'
import { generateKeyPairSync } from 'crypto'

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

jest.mock('fs/promises')

describe('JWT Middleware Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks() // Ensure mocks are cleared before each test
  })

  it('should verify the token and set params in request', async () => {
    const req: Request = {
      headers: { authorization: 'Bearer valid_token' },
      params: {},
    } as Request
    const res: Response = { sendStatus: jest.fn() } as unknown as Response
    const next: NextFunction = jest.fn() as NextFunction

    jest
      .spyOn(jwt, 'verify')
      .mockImplementation((_token, _secretOrPublicKey, _options, callback) => {
        if (callback) {
          return callback(null, { username: 'test', role: '1' })
        } else {
          throw new Error('Callback function is not defined')
        }
      })

    await verifyJWT(req, res, next)

    expect(jwt.verify).toHaveBeenCalledWith()

    expect(req.params.username).toEqual('test')
    expect(req.params.roleId).toEqual('1')

    expect(next).toHaveBeenCalled()
  })
})
