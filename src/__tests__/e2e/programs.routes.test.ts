import { Application, json } from 'express'
import createServer from '../../utils/server'
import request from 'supertest'
import { redisClient } from '../../utils/redis'
import prisma from '../../utils/client'
import { generateTokens } from '../../utils/auth'
import { User } from '@prisma/client'

jest.setTimeout(30000)
jest.unmock('../../utils/client')

let app: Application
let user: User
let programs: any
let companyId: string
let tokens = {
  accessToken: '',
  refreshToken: '',
}

describe('GET /programs', () => {
  beforeAll(async () => {
    app = await createServer()
    const users = await prisma.user.findMany()
    user = users[0]
    const prismaPrograms = await prisma.program.findMany()
    companyId = prismaPrograms[0].companyId
    programs = JSON.parse(JSON.stringify(prismaPrograms))
    tokens = await generateTokens(user)
  })

  afterAll(async () => {
    await redisClient.disconnect()
  })

  it('should GET all of the programs', async () => {
    const response = await request(app)
      .get('/api/v1/programs')
      .set('Authorization', `Bearer ${tokens.accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ programs: programs })
  })

  it('should GET ACTIVE programs', async () => {
    const response = await request(app)
      .get('/api/v1/programs?status=active')
      .set('Authorization', `Bearer ${tokens.accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ programs: [programs[1]] })
  })

  it('should GET Company programs', async () => {
    const response = await request(app)
      .get(`/api/v1/programs?company=${companyId}`)
      .set('Authorization', `Bearer ${tokens.accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ programs: programs })
  })
})
