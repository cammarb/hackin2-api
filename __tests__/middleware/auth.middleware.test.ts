import { Request, Response, NextFunction } from 'express'
import * as fs from 'fs/promises'
import * as jwt from 'jsonwebtoken'
import { verifyJWT } from '../../src/middleware/auth.middleware'

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

    const verifyMock = jest.spyOn(jwt, 'verify').mockImplementation(
      jest.fn((_token, _secretOrPublicKey, _options, callback) => {
        if (callback) {
          return callback(null, { username: 'test', role: '1' })
        } else {
          throw new Error('Callback function is not defined')
        }
      })
    )

    jest.spyOn(fs, 'readFile').mockResolvedValue('your_public_key')

    await verifyJWT(req, res, next)

    expect(verifyMock).toHaveBeenCalledWith(
      'valid_token',
      'your_public_key',
      undefined,
      expect.any(Function)
    )

    expect(req.params.username).toEqual('test')
    expect(req.params.roleId).toEqual('1')

    expect(next).toHaveBeenCalled()
  })
})
