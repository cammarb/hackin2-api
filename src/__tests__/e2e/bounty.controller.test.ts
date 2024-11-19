import type { Application } from 'express'
import createServer from '../../utils/server'
import prisma from '../../utils/client'
import { redisClient } from '../../utils/redis'
import { getBounties } from '../../bounty/bounty.service'
import request from 'supertest'
import { type Bounty, type Program, Role } from '@prisma/client'
import type { SessionData } from 'express-session'
import type supertest from 'supertest'

jest.setTimeout(30000)
jest.unmock('../../utils/client')

describe('GET Bounties from a Program', () => {
  let app: Application
  let bounties: Bounty[]
  let program: Program
  let loginResponse: supertest.Response
  let userSession: SessionData['user']

  beforeAll(async () => {
    app = await createServer()
    const user = await prisma.user.findFirst({
      where: {
        role: Role.PENTESTER
      }
    })
    if (!user) return

    userSession = {
      logged_in: true,
      id: user.id,
      username: user.username,
      role: user.role as Role
    } as SessionData['user']

    loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: user.username, password: 'testpassword' })

    const prismaPrograms = await prisma.program.findMany()
    program = prismaPrograms[0]
    const prismaBounties = await getBounties(
      { program: program.id },
      userSession
    )
    bounties = JSON.parse(JSON.stringify(prismaBounties))
  })

  afterAll(async () => {
    await redisClient.disconnect()
  })

  afterEach(async () => {
    await redisClient.flushAll()
  })

  it('should get them from the Database - PostgreSQL', async () => {
    const accessToken = loginResponse.body.user.token
    const sessionCookie = loginResponse.headers['set-cookie']

    const response = await request(app)
      .get(`/api/v1/bounties?program=${program.id}`)
      .set('Cookie', sessionCookie)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ bounties: bounties })
  })

  it('should them from Cache - Redis', async () => {
    const cacheKey = `bounties?program=${program.id}`
    await redisClient.set(cacheKey, JSON.stringify(bounties), { EX: 500 })

    const accessToken = loginResponse.body.user.token
    const sessionCookie = loginResponse.headers['set-cookie']

    const response = await request(app)
      .get(`/api/v1/bounties?program=${program.id}`)
      .set('Cookie', sessionCookie)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ bounties: bounties, cache: true })
  })
})
