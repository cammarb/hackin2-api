import request from 'supertest'
import express, { Express } from 'express'
import authRouter from '../../src/routes/api/v1/auth/auth.routes'
import {
  handleLogin,
  handleLogOut,
  handleRefreshToken,
} from '../../src/controllers/auth.controller'
import app from '../../src/app'

jest.mock('../../src/controllers/auth.controller')

describe('Auth Routes', () => {
  app.use(express.json())
  app.use('/auth', authRouter)
  test('POST /auth/login should call handleLogin', async () => {
    const userData = {
      username: 'testUser',
      password: 'testPassword',
    }

    await request(app).post('/auth/login').send(userData).expect(200)

    expect(handleLogin).toHaveBeenCalledWith(userData)
  })

  test('POST /auth/logout should call handleLogOut', async () => {
    await request(app).post('/auth/logout').expect(200)

    expect(handleLogOut).toHaveBeenCalled()
  })

  test('GET /auth/refresh should call handleRefreshToken', async () => {
    await request(app).get('/auth/refresh').expect(200)

    expect(handleRefreshToken).toHaveBeenCalled()
  })
})
