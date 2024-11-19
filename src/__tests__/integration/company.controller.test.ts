import type { Request, Response } from 'express'
import {
  editCompanyController,
  getCompanyByIdController
} from '../../company/company.controller'
import { prismaMock } from '../__mocks__/prismaMock'
import type { Company } from '@prisma/client'

const mockCompany: Company = {
  id: 'testId',
  name: 'Test Company',
  email: 'company@email.com',
  website: 'https://testCompany.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  stripeAccountId: 'companyStripeAccountId'
}

describe('getCompany function', () => {
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    req = {
      params: {
        id: mockCompany.id
      }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return company information', async () => {
    prismaMock.company.findUnique.mockResolvedValueOnce(mockCompany)

    await getCompanyByIdController(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: `Welcome to Company ${mockCompany.name}.`
    })
  })

  it('should handle errors', async () => {
    prismaMock.company.findUnique.mockRejectedValueOnce(
      new Error('Internal Server Error')
    )

    await getCompanyByIdController(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})

describe('editCompany function', () => {
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    req = {
      params: {
        id: mockCompany.id
      },
      body: {
        website: mockCompany.website
      }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update company information', async () => {
    prismaMock.company.update.mockResolvedValueOnce(mockCompany)

    await editCompanyController(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      company: mockCompany
    })
  })

  it('should handle errors', async () => {
    prismaMock.company.update.mockRejectedValueOnce(
      new Error('Internal Server Error')
    )

    await editCompanyController(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
