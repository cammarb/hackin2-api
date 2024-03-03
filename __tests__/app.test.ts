import request from 'supertest'

import app from '../src/app'

describe('Test app.ts', () => {
  test('Main route', async () => {
    return request(app)
      .get('/api/v1')
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: 'Welcome to the Hackin2 API.' })
      })
  })
})
