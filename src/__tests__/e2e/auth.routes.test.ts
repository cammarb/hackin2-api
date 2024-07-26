import { disconnectRedis, redisClient } from '../../utils/redis'
import createServer from '../../utils/server'
import express, {
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express'
import {
  handleLogOut,
  handleLogin,
  handleRefreshToken,
  handleRegistration,
  validateOTP,
} from '../../auth/auth.controller'
import { authRouter } from '../../auth/auth.routes'
import request from 'supertest'
import nodemailer from 'nodemailer'
import { Role } from '@prisma/client'
import prisma from '../../utils/client'

jest.setTimeout(60000)
jest.mock('nodemailer')
let mockSendMail: jest.Mock<any, any, any>
jest.unmock('../../utils/client')

const userData = {
  username: 'steve.jobs',
  email: 'steve.jobs@email.com',
  firstName: 'Steve',
  lastName: 'Jobs',
  password: 'password',
  role: Role.ENTERPRISE,
}

let app: Application

describe('POST /api/v1/auth/register', () => {
  beforeAll(async () => {
    app = await createServer()

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
    await redisClient.disconnect()
  })

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData)

    expect(response.body).toHaveProperty('success', 'User created successfully')
    expect(response.status).toBe(201)

    const user = await prisma.user.findUnique({
      where: { username: 'steve.jobs' },
    })

    expect(user).toBeTruthy()
    expect(user?.email).toBe('steve.jobs@email.com')
    expect(user?.firstName).toBe('Steve')
    expect(user?.lastName).toBe('Jobs')
    expect(user?.role).toBe('ENTERPRISE')

    const redisKey = await redisClient.get('steve.jobs@email.com')
    expect(redisKey).toBeTruthy()
  })

  it('should not register a new user when their email or username already exists', async () => {
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
