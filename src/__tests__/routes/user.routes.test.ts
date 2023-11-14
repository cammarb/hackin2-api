import request from 'supertest'
import app from '../../app'
import { verifyJWT } from '../../middleware/auth.middleware'

jest.mock('../../middleware/auth.middleware.ts/verifyJWT', () => ({
  verifyJWT,
}))

describe('User routes', () => {
  test('Get all users', async () => {
    const res = await request(app).get('/users').expect(200)

    expect(res.body.users).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          roleId: expect.any(Number),
        },
      ])
    )
    expect(verifyJWT).toHaveBeenCalled()
  })
})
