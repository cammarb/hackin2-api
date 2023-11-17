import { Request, Response } from 'express'
import prisma from '../../src/config/db'
import {
  newUser,
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
} from '../../src/controllers/user.controller'

jest.mock('../../src/config/db')

const mockedPrisma = prisma

jest.mock('@prisma/client', () => ({
  ...jest.requireActual('@prisma/client'),
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('User Controller Tests', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  // describe('newUser', () => {
  //   test('Should create a new user successfully', async () => {
  //     const req = {
  //       body: {
  //         username: 'newuser',
  //         email: 'newuser@example.com',
  //         firstName: 'New',
  //         lastName: 'User',
  //         password: 'password123',
  //         roleId: '1',
  //       },
  //     } as Request

  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     } as unknown as Response

  //     prisma.user.findMany.mockResolvedValueOnce([]) // Mocking an empty array to simulate a non-existing user

  //     await newUser(req, res)

  //     expect(res.status).toHaveBeenCalledWith(201)
  //     expect(res.json).toHaveBeenCalledWith({
  //       success: 'User created successfully',
  //     })
  //   })

  //   test('Should return a 400 status if required fields are missing', async () => {
  //     const req = {
  //       body: {
  //         // Missing required fields
  //       },
  //     } as Request

  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     } as unknown as Response

  //     await newUser(req, res)

  //     expect(res.status).toHaveBeenCalledWith(400)
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: 'All the fields are required',
  //     })
  //   })

  //   test('Should return a 400 status if email is not valid', async () => {
  //     const req = {
  //       body: {
  //         username: 'testuser',
  //         email: 'invalidemail',
  //         firstName: 'Test',
  //         lastName: 'User',
  //         password: 'password123',
  //         roleId: '1',
  //       },
  //     } as Request

  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     } as unknown as Response

  //     await newUser(req, res)

  //     expect(res.status).toHaveBeenCalledWith(400)
  //     expect(res.json).toHaveBeenCalledWith({ message: 'Enter a valid email' })
  //   })

  //   test('Should return a 409 status if user already exists', async () => {
  //     const req = {
  //       body: {
  //         username: 'existinguser',
  //         email: 'existinguser@example.com',
  //         firstName: 'Existing',
  //         lastName: 'User',
  //         password: 'password123',
  //         roleId: '1',
  //       },
  //     } as Request

  //     const res = {
  //       sendStatus: jest.fn(),
  //     } as unknown as Response

  //     prisma.user.findMany.mockResolvedValueOnce([{ id: 1 }]) // Mocking an existing user

  //     await newUser(req, res)

  //     expect(res.sendStatus).toHaveBeenCalledWith(409)
  //   })

  //   test('Should return a 500 status if an error occurs during user creation', async () => {
  //     const req = {
  //       body: {
  //         username: 'newuser',
  //         email: 'newuser@example.com',
  //         firstName: 'New',
  //         lastName: 'User',
  //         password: 'password123',
  //         roleId: '1',
  //       },
  //     } as Request

  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     } as unknown as Response

  //     prisma.user.findMany.mockRejectedValueOnce(new Error('Database error'))

  //     await newUser(req, res)

  //     expect(res.status).toHaveBeenCalledWith(500)
  //     expect(res.json).toHaveBeenCalledWith({ message: 'Database error' })
  //   })
  // })

  describe('getAllUsers', () => {
    test('Should return a list of users', async () => {
      const req = {} as Request

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      const mockUsers = [
        {
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          roleId: expect.any(Number),
        },
        {
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          roleId: expect.any(Number),
        },
      ]
      ;(mockedPrisma.user.findMany as jest.Mock).mockResolvedValueOnce(
        mockUsers
      )

      await getAllUsers(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockUsers)
    })

    //   test('Should return a 500 status if an error occurs during user retrieval', async () => {
    //     const req = {} as Request

    //     const res = {
    //       status: jest.fn().mockReturnThis(),
    //       json: jest.fn(),
    //     } as unknown as Response

    //     prisma.user.findMany.mockRejectedValueOnce(new Error('Database error'))

    //     await getAllUsers(req, res)

    //     expect(res.status).toHaveBeenCalledWith(500)
    //     expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
    //   })
    // })
    // describe('getUser', () => {
    //   test('Should return user details', async () => {
    //     const req = {
    //       params: { username: 'testuser', roleId: '1' },
    //     } as Request

    //     const res = {
    //       status: jest.fn().mockReturnThis(),
    //       json: jest.fn(),
    //     } as unknown as Response

    //     const mockUser = {
    //       id: 1,
    //       username: 'testuser',
    //       email: 'testuser@example.com',
    //     }

    //     prisma.user.findUnique.mockResolvedValueOnce(mockUser)

    //     await getUser(req, res)

    //     expect(res.status).toHaveBeenCalledWith(200)
    //     expect(res.json).toHaveBeenCalledWith({
    //       id: mockUser.id,
    //       username: mockUser.username,
    //       email: mockUser.email,
    //     })
    //   })

    //   test('Should return a 404 status if user is not found', async () => {
    //     const req = {
    //       params: { username: 'nonexistentuser', roleId: '1' },
    //     } as Request
    //   })
  })
})
