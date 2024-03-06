import request from 'supertest'

import createServer from '../utilts/server'

const app = createServer()

describe('app.ts', () => {
  it('should respond with a 200 status in /api/v*/ ', async () => {
    return request(app)
      .get('/')
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: 'Welcome to the Hackin2 API.' })
      })
  })
})
