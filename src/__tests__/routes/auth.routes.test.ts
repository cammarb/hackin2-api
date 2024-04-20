import express, { NextFunction, Request, Response, Router } from 'express'
import {
  handleLogOut,
  handleLogin,
  handleRefreshToken,
  handleRegistration,
} from '../../controllers/auth.controller'
import authRouter from '../../routes/auth.routes'

jest.mock('express', () => ({
  Router: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
}))

jest.mock('../../controllers/auth.controller', () => ({
  handleLogOut: jest.fn(),
  handleLogin: jest.fn(),
  handleRefreshToken: jest.fn(),
  handleRegistration: jest.fn(),
}))

describe('Auth routes', () => {
  let router: Router
  let req: Request | any
  let res: Response | any

  beforeEach(() => {
    req = {}
    res = {
      send: jest.fn(),
      status: jest.fn(() => res),
    }
    router = authRouter
  })

  test('Handle Registration route', async () => {
    expect(router.post).toHaveBeenCalledWith('/register', handleRegistration)
  })
  test('Handle Log In route', async () => {
    expect(router.post).toHaveBeenCalledWith('/login', handleLogin)
  })
  test('Handle Log Out route', async () => {
    expect(router.post).toHaveBeenCalledWith('/logout', handleLogOut)
  })
  test('Handle Refresh Token route', async () => {
    expect(router.get).toHaveBeenCalledWith('/refresh', handleRefreshToken)
  })
})
