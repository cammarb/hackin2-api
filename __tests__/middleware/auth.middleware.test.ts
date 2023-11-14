import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { verifyJWT } from '../../src/middleware/auth.middleware'
import { publicKey } from '../../src/app'

jest.mock('jsonwebtoken')

describe('JWT Middleware Tests', () => {
  it('should verify the token and set params in request', async () => {
    const req: Request = {
      headers: { authorization: 'Bearer valid_token' },
      params: {},
    } as Request
    const res: Response = { sendStatus: jest.fn() } as unknown as Response
    const next: NextFunction = jest.fn() as NextFunction

    ;(jwt.verify as jest.Mock).mockImplementationOnce(
      (_token, _secretOrPublicKey, _options, callback) => {
        const payload = { username: 'test', role: '1' }
        if (callback) {
          process.nextTick(() => callback(null, payload))
        } else {
          return payload
        }
      }
    )

    await verifyJWT(req, res, next)

    expect(req.headers.authorization).toEqual('Bearer valid_token')
    expect(jwt.verify).toHaveBeenCalledWith(
      'valid_token',
      publicKey,
      undefined,
      expect.any(Function)
    )

    expect(req.params.username).toEqual('test')
    expect(req.params.role).toEqual('1')

    expect(next).toHaveBeenCalled()
  })
})
