import { Application } from 'express'
import createServer from '../../utils/server'
import request from 'supertest'
import { redisClient } from '../../utils/redis'
import prisma from '../../utils/client'
import { ProgramStatus } from '@prisma/client'

jest.setTimeout(3000)
jest.unmock('../../utils/client')

let app: Application

const programs = [
  {
    id: '766a82e0-4cdb-4628-a8aa-c9cdbdd727dd',
    name: 'Program A',
    companyId: '832d9489-bb58-438a-9445-a904456ecfeb',
    description: 'This is the description for Program A',
    programStatus: ProgramStatus.DRAFT,
    location: 'Berlin',
    createdAt: '2024-07-19T09:03:13.563Z',
    updatedAt: '2024-07-19T09:03:13.563Z',
  },
  {
    id: 'a3200808-97da-497c-8128-336efe1694b2',
    name: 'Program B',
    companyId: '832d9489-bb58-438a-9445-a904456ecfeb',
    description: 'This is the description for Program B',
    programStatus: ProgramStatus.ACTIVE,
    location: 'Berlin',
    createdAt: '2024-07-19T09:03:13.563Z',
    updatedAt: '2024-07-19T09:03:13.563Z',
  },
]

describe('GET /programs', () => {
  beforeAll(async () => {
    app = await createServer()
    await prisma.$connect()
    prisma.program.createMany({
      data: programs,
    })
  })

  afterAll(async () => {
    await redisClient.disconnect()
  })

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
