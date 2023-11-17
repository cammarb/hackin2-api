import request from 'supertest'

import app from '../src/app'

describe('Test app.ts', () => {
  test('Main route', async () => {
    const res = await request(app).get('/')
    expect(res.body).toEqual({ message: 'Hello Hackin2' })
  })
})
