import { Request, Response, NextFunction } from 'express'
import { getEnvs } from '../../utils/envs'
import { verifyJWT } from '../../auth/auth.middleware'

jest.mock('../../utils/envs', () => ({
  getEnvs: jest.fn().mockResolvedValue({
    port: 'fakePort',
    privateKey: 'fakePrivateKey',
    publicKey: 'fakePublicKey',
    issuer: 'fakeIssuer',
    origin: 'fakeOrigin',
  }),
}))

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ username: 'username', role: 'role' }),
}))

describe('verifyJWT middleware function', () => {
  let req: Request | any
  let res: Response | any
  let next: NextFunction
  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer jwtToken',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  test('Should verify the jwt token and call the next() funcition', async () => {
    await verifyJWT(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.username).toBe('username')
    expect(req.role).toBe('role')
  })

  test('Should throw error when jwt is missing in headers', async () => {
    req.headers = {}
    await verifyJWT(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
  })
})
