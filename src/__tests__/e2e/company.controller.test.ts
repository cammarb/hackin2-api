import type { Request, Response } from 'express'
import {
  editCompanyController,
  getCompanyByIdController
} from '../../company/company.controller'
import { prismaMock } from '../__mocks__/prismaMock'
import { CompanyRole, Role } from '@prisma/client'

const mockCompanyMembers = [
  {
    userId: '1',
    companyId: 'testCompanyId',
    companyRole: CompanyRole.OWNER,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: '2',
    companyId: 'testCompanyId',
    companyRole: CompanyRole.MEMBER,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockCompany = {
  id: 'testId',
  name: 'Test Company',
  ownerId: 'testOwnerId',
  CompanyMember: mockCompanyMembers,
  website: 'https://testCompany.com',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('getCompany function', () => {
  let req: Request | any
  let res: Response | any

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
  let req: Request | any
  let res: Response | any

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
