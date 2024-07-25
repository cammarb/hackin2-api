import { redisClient } from '../../utils/redis'
import createServer from '../../utils/server'
import express, {
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express'
import request from 'supertest'
import nodemailer from 'nodemailer'
import prisma from '../../utils/client'
import { Prisma, Role } from '@prisma/client'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { PrismaClient } from '@prisma/client'
import { RedisContainer } from '@testcontainers/redis'

jest.setTimeout(3000)
jest.mock('nodemailer')
let mockSendMail: jest.Mock<any, any, any>
jest.unmock('../../utils/client')

const userData = {
  username: 'john.doe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  role: Role.ENTERPRISE,
}

let app: Application

describe('POST /api/v1/auth/register', () => {
  beforeAll(async () => {
    app = await createServer()
    await prisma.$connect()
    mockSendMail = jest.fn().mockResolvedValue('mocked response')
    nodemailer.createTransport = jest
      .fn()
      .mockReturnValue({ sendMail: mockSendMail })
  })

  afterEach(async () => {
    await prisma.user.deleteMany()
    await redisClient.flushAll()
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await redisClient.disconnect()
  })

  it('should register a new user', async () => {
    const app = await createServer()
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData)

    expect(response.body).toHaveProperty('success', 'User created successfully')
    expect(response.status).toBe(201)

    const user = await prisma.user.findUnique({
      where: { username: 'john.doe' },
    })

    expect(user).toBeTruthy()
    expect(user?.email).toBe('john.doe@example.com')
    expect(user?.firstName).toBe('John')
    expect(user?.lastName).toBe('Doe')
    expect(user?.role).toBe('ENTERPRISE')

    const redisKey = await redisClient.get('john.doe@example.com')
    expect(redisKey).toBeTruthy()
  })

  it('should not register a new user when their email or username already exists', async () => {
    const app = await createServer()

    const user = await prisma.user.create({
      data: userData,
    })

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData)

    expect(response.status).toBe(409)
    expect(response.body).toEqual({ message: 'User already exists' })
  })
})
