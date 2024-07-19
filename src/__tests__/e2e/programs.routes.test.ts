import { Application } from 'express'
import createServer from '../../utils/server'
import request from 'supertest'
import { disconnectRedis, redisClient } from '../../utils/redis'
import prisma from '../../utils/client'

jest.unmock('../../utils/client')

let app: Application

beforeAll(async () => {
  app = await createServer()
  await prisma.$connect()
})

afterAll(async () => {
  await disconnectRedis()
})

const programs = [
  {
    id: '766a82e0-4cdb-4628-a8aa-c9cdbdd727dd',
    name: 'Program A',
    companyId: '832d9489-bb58-438a-9445-a904456ecfeb',
    description: 'This is the description for Program A',
    programStatus: 'DRAFT',
    location: 'Berlin',
    createdAt: '2024-07-19T09:03:13.563Z',
    updatedAt: '2024-07-19T09:03:13.563Z',
  },
  {
    id: 'a3200808-97da-497c-8128-336efe1694b2',
    name: 'Program B',
    companyId: '832d9489-bb58-438a-9445-a904456ecfeb',
    description: 'This is the description for Program B',
    programStatus: 'ACTIVE',
    location: 'Berlin',
    createdAt: '2024-07-19T09:03:13.563Z',
    updatedAt: '2024-07-19T09:03:13.563Z',
  },
]

describe('GET /programs', () => {
  it('should GET all of the programs', async () => {
    const response = await request(app).get('/api/v1/programs')

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ programs: programs })
  })

  it('should GET ACTIVE programs', async () => {
    const response = await request(app).get('/api/v1/programs?status=active')

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ programs: [programs[1]] })
  })

  it('should GET Company programs', async () => {
    const response = await request(app).get(
      '/api/v1/programs?company=766a82e0-4cdb-4628-a8aa-c9cdbdd727dd',
    )

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ programs: [programs[0]] })
  })
})
