import { type Application, json } from 'express'
import createServer from '../../utils/server'
import request from 'supertest'
import { redisClient } from '../../utils/redis'
import { generateTokens } from '../../utils/auth'
import { generateTestcontainerData } from '../testcontainers/generateTestcontainerData'
import prisma from '../../utils/client'
import { Prisma, Program, Role, User } from '@prisma/client'

jest.setTimeout(30000)
jest.unmock('../../utils/client')

const programWithCompanyInclude = Prisma.validator<Prisma.ProgramInclude>()({
  Company: {
    select: {
      name: true
    }
  }
})
type ProgramWithCompany = Prisma.ProgramGetPayload<{
  include: typeof programWithCompanyInclude
}>

describe('GET /programs', () => {
  let app: Application
  let tokens: {
    accessToken: string
    refreshToken: string
  }

  let jsonPrograms: ProgramWithCompany[]

  beforeAll(async () => {
    await generateTestcontainerData()

    app = await createServer()
    const user = await prisma.user.findFirst({
      where: {
        role: Role.ENTERPRISE
      }
    })
    if (user) tokens = await generateTokens(user)
    const programs = await prisma.program.findMany({
      include: {
        Company: {
          select: {
            name: true
          }
        }
      }
    })
    jsonPrograms = JSON.parse(JSON.stringify(programs))
  })

  afterAll(async () => {
    await redisClient.disconnect()
  })

  it('should GET all of the programs', async () => {
    const response = await request(app)
      .get('/api/v1/programs')
      .set('Authorization', `Bearer ${tokens.accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({
      programs: jsonPrograms
    })
  })

  it('should GET ACTIVE programs', async () => {
    const response = await request(app)
      .get('/api/v1/programs?status=active')
      .set('Authorization', `Bearer ${tokens.accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ programs: [jsonPrograms[1]] })
  })

  it('should GET Company programs', async () => {
    const companyId = jsonPrograms[0].companyId

    const response = await request(app)
      .get(`/api/v1/programs?company=${companyId}`)
      .set('Authorization', `Bearer ${tokens.accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ programs: jsonPrograms })
  })
})
