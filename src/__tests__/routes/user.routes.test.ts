import express, { Router } from 'express'
import {
  getUser,
  editUser,
  deleteUser,
} from '../../controllers/user.controller'
import { verifyJWT } from '../../middleware/auth.middleware'
import userRouter from '../../routes/user.routes'

jest.mock('express', () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('../../controllers/user.controller', () => ({
  getUser: jest.fn(),
  editUser: jest.fn(),
  deleteUser: jest.fn(),
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
    router = userRouter
  })

  test('GET user /account', async () => {
    expect(router.get).toHaveBeenCalledWith('/account', verifyJWT, getUser)
  })
  test('PUT editUser /account/edit', async () => {
    expect(router.put).toHaveBeenCalledWith('/account/edit', editUser)
  })
  test('DELETE deleUser /account/delete', async () => {
    expect(router.delete).toHaveBeenCalledWith('/account/delete', deleteUser)
  })
})
