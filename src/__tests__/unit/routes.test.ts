import { Application, Request, Response } from 'express'
import routes from '../../routes'
import { apiRoutes } from '../../routes/api.routes'

jest.mock('../../routes/api.routes', () => ({
  apiRoutes: jest.fn(),
}))

describe('Routes setup', () => {
  let appMock: Application

  beforeEach(() => {
    appMock = {
      get: jest.fn(),
      use: jest.fn(),
    } as unknown as Application
  })

  it('should redirect root endpoint to /api/v1', () => {
    routes(appMock)
    expect(appMock.get).toHaveBeenCalledWith('/', expect.any(Function))
    const [, callback] = (appMock.get as jest.Mock).mock.calls[0]
    const reqMock = {} as Request
    const resMock = {
      redirect: jest.fn(),
    } as unknown as Response
    callback(reqMock, resMock)
    expect(resMock.redirect).toHaveBeenCalledWith(301, '/api/v1')
  })

  it('should use /api/v1 routes', () => {
    routes(appMock)
    expect(appMock.use).toHaveBeenCalledWith('/api/v1', apiRoutes)
  })
})
