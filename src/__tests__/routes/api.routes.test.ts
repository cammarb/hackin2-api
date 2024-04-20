import { Router } from 'express'
import { apiRoutes } from '../../routes/api.routes'
import authRouter from '../../routes/auth.routes'
import userRouter from '../../routes/user.routes'
import companyRouter from '../../routes/company.routes'
import { verifyJWT } from '../../middleware/auth.middleware'
import {
  checkEnterprise,
  allowedRoles,
} from '../../middleware/roles.middleware'

jest.mock('express', () => ({
  Router: () => ({
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}))

jest.mock('../../middleware/auth.middleware', () => ({
  verifyJWT: jest.fn(),
}))

jest.mock('../../middleware/roles.middleware', () => ({
  checkEnterprise: jest.fn(),
  allowedRoles: jest.fn(),
}))

jest.mock('../../routes/auth.routes', () => ({
  authRouter: jest.fn(),
  userRouter: jest.fn(),
  companyRouter: jest.fn(),
}))

describe('API routes', () => {
  test('Should set up API routes correctly', () => {
    expect(apiRoutes.use).toHaveBeenCalledWith('/auth', authRouter)
    expect(apiRoutes.use).toHaveBeenCalledWith('/user', verifyJWT, userRouter)
    expect(apiRoutes.use).toHaveBeenCalledWith(
      '/company',
      verifyJWT,
      checkEnterprise,
      companyRouter,
    )
  })
})
