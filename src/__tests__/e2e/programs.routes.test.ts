import { Application, json } from 'express'
import createServer from '../../utils/server'
import request from 'supertest'
import { redisClient } from '../../utils/redis'
import prisma from '../../utils/client'

jest.setTimeout(30000)
jest.unmock('../../utils/client')

let app: Application
let programs: any
let companyId: string

describe('GET /programs', () => {
  beforeAll(async () => {
    app = await createServer()
    const prismaPrograms = await prisma.program.findMany()
    programs = JSON.parse(JSON.stringify(prismaPrograms))

    companyId = prismaPrograms[0].companyId
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
      `/api/v1/programs?company=${companyId}`,
    )

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ programs: programs })
  })
})
