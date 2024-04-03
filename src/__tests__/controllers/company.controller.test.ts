import { Request, Response } from 'express'
import {
  editCompany,
  getCompany,
  getCompanyMembers,
} from '../../controllers/company.controller'
import prisma from '../../utilts/client'

jest.mock('../../utilts/client', () => ({
  __esModule: true,
  default: {
    company: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

describe('getCompany function', () => {
  let req: Request | any
  let res: Response | any

  beforeEach(() => {
    req = {
      companyId: 'testCompanyId',
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return company information', async () => {
    const mockCompany = { name: 'Test Company' }
    ;(prisma.company.findUnique as jest.Mock).mockResolvedValueOnce(mockCompany)

    await getCompany(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: `Welcome to Company ${mockCompany.name}.`,
    })
  })

  it('should handle errors', async () => {
    ;(prisma.company.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error'),
    )

    await getCompany(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})

describe('editCompany function', () => {
  let req: Request | any
  let res: Response | any

  beforeEach(() => {
    req = {
      companyId: 'testCompanyId',
      body: {
        newName: 'New Company Name',
        newOwner: 'New Owner ID',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update company information', async () => {
    const mockCompany = {
      id: 'testCompanyId',
      name: 'Test Company',
      ownerId: 'Old Owner ID',
    }

    ;(prisma.company.update as jest.Mock).mockResolvedValueOnce(mockCompany)

    await editCompany(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      company: mockCompany,
    })
  })

  it('should handle errors', async () => {
    ;(prisma.company.update as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error'),
    )

    await editCompany(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})

describe('getCompanyMembers', () => {
  let req: Request | any
  let res: Response | any

  beforeEach(() => {
    req = {
      companyId: 'testCompanyId',
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get Company Members from given Company ID', async () => {
    const mockCompany = {
      id: 'testCompanyId',
      CompanyMember: [
        {
          userId: '1',
          companyId: 'testCompanyId',
          companyRole: 'OWNER',
        },
        {
          userId: '2',
          companyId: 'testCompanyId',
          companyRole: 'MEMBER',
        },
      ],
    }

    ;(prisma.company.findUnique as jest.Mock).mockResolvedValueOnce(mockCompany)

    await getCompanyMembers(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      members: mockCompany.CompanyMember,
    })
  })

  it('should handle errors', async () => {
    ;(prisma.company.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error'),
    )

    await getCompanyMembers(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
