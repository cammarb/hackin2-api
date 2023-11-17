import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { verifyJWT } from '../../src/middleware/auth.middleware' // Update the path accordingly
import { publicKey } from '../../src/app'

const mockRequest = {
  headers: {
    authorization: 'Bearer mockToken',
  },
  params: {} as Record<string, string>,
} as Request & { [key: string]: any }
const mockResponse = {
  sendStatus: jest.fn(),
} as unknown as Response
const mockNext = jest.fn() as NextFunction

jest.mock('../../src/app', () => ({
  publicKey: 'mockPublicKey',
}))

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}))

describe('verifyJWT middleware', () => {
  it('should call next() if token is valid', async () => {
    const mockToken = 'mockToken'
    const decodedMock = {
      username: 'mockUsername',
      role: 'mockRole',
    }

    ;(jwt.verify as jest.Mock).mockImplementationOnce(
      (token, secret, callback) => {
        callback(null, decodedMock)
      }
    )

    await verifyJWT(mockRequest, mockResponse, mockNext)

    console.log(mockResponse)

    expect((mockRequest.headers.authorization as string).split).toBeDefined()

    expect((mockRequest.headers.authorization as string).split(' ')[1]).toBe(
      mockToken
    )

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, publicKey)

    expect(mockRequest.params.username).toEqual(decodedMock.username)
    expect(mockRequest.params.roleId).toEqual(decodedMock.role)
    expect(mockNext).toHaveBeenCalled()
  })

  it('should send 403 status if token is expired', async () => {
    const mockToken = 'expiredToken'

    await verifyJWT(mockRequest, mockResponse, mockNext)

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(403)
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should send 401 status if authorization header or secret is missing', async () => {
    jest.clearAllMocks()

    await verifyJWT(mockRequest, mockResponse, mockNext)

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(401)
    expect(mockNext).not.toHaveBeenCalled()
  })
})
