import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { verifyJWT } from '../../src/middleware/auth.middleware'

describe('JWT Middleware Tests', () => {
  it('should verify the token and set params in request', async () => {
    const req: Request = {
      headers: { authorization: 'Bearer valid_token' },
      params: {},
    } as Request
    const res: Response = { sendStatus: jest.fn() } as unknown as Response
    const next: NextFunction = jest.fn() as NextFunction

    const mockedVerify = jest
      .spyOn(jwt, 'verify')
      .mockImplementationOnce((token, publicKey, options, callback) => {
        if (callback) {
          callback(null, { username: 'test', role: '1' })
        } else {
          throw new Error('Callback function is not defined')
        }
      })

    await verifyJWT(req, res, next)

    expect(req.headers.authorization).toEqual('Bearer valid_token')
    expect(mockedVerify).toHaveBeenCalledWith(
      'valid_token',
      'your_public_key',
      undefined,
      expect.any(Function)
    )

    expect(req.params.username).toEqual('test')
    expect(req.params.role).toEqual('1')

    expect(next).toHaveBeenCalled()
  })
})
