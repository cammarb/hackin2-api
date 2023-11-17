import request from 'supertest'
import app from '../../src/app'
import { verifyJWT } from '../../src/middleware/auth.middleware'
import userRouter from '../../src/routes/user.routes'
import { getAllUsers } from '../../src/controllers/user.controller'

jest.mock('../../src/middleware/auth.middleware')

describe('User routes', () => {
  app.use('/user', userRouter)
  test('Get all users', async () => {
    const res = await request(app).get('/').expect(200)

    // expect(res.body).toEqual(
    //   expect.arrayContaining([
    //     {
    //       id: expect.any(Number),
    //       firstName: expect.any(String),
    //       lastName: expect.any(String),
    //       username: expect.any(String),
    //       email: expect.any(String),
    //       password: expect.any(String),
    //       roleId: expect.any(Number),
    //     },
    //   ])
    // )
    expect(verifyJWT).toHaveBeenCalled()
    expect(getAllUsers).toHaveBeenCalled()
  })
})
