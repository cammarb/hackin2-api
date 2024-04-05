import { Request, Response } from 'express'
import {
  editCompany,
  getCompany,
  getCompanyMembers,
  inviteCompanyMembers,
} from '../../controllers/company.controller'
import { prismaMock } from '../../../singleton'
import { Role } from '@prisma/client'

const mockCompanyMembers = [
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
]

const mockCompany = {
  id: 'testId',
  name: 'Test Company',
  ownerId: 'testOwnerId',
  CompanyMember: mockCompanyMembers,
}

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
    prismaMock.company.findUnique.mockResolvedValueOnce(mockCompany)

    await getCompany(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: `Welcome to Company ${mockCompany.name}.`,
    })
  })

  it('should handle errors', async () => {
    prismaMock.company.findUnique.mockRejectedValueOnce(
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
    prismaMock.company.update.mockResolvedValueOnce(mockCompany)

    await editCompany(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      company: mockCompany,
    })
  })

  it('should handle errors', async () => {
    prismaMock.company.update.mockRejectedValueOnce(
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
    prismaMock.company.findUnique.mockResolvedValueOnce(mockCompany)

    await getCompanyMembers(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      members: mockCompany.CompanyMember,
    })
  })

  it('should handle errors', async () => {
    prismaMock.company.findUnique.mockRejectedValueOnce(
      new Error('Internal Server Error'),
    )

    await getCompanyMembers(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})

describe('inviteCompanyMembers', () => {
  let req: Request | any
  let res: Response | any

  beforeEach(() => {
    req = {
      companyId: 'testCompanyId',
      body: {
        email: 'test@email.com',
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

  it('should invite a new member to the company', async () => {
    const mockUser = {
      id: '1',
      username: req.body.email.split('@')[0],
      email: req.body.email,
      firstName: '',
      lastName: '',
      password: 'password',
      role: Role.ENTERPRISE,
      mfa: false,
      confirmed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    prismaMock.user.create.mockResolvedValueOnce(mockUser)
    prismaMock.companyMember.create.mockResolvedValueOnce({
      companyId: req.companyId,
      companyRole: 'MEMBER',
      userId: mockUser.id,
    })

    await inviteCompanyMembers(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: `Invitation sent to ${mockUser.email}.`,
    })
  })

  it('should handle errors', async () => {
    prismaMock.user.create.mockRejectedValueOnce(
      new Error('Internal Server Error'),
    )
    prismaMock.companyMember.create.mockRejectedValueOnce(
      new Error('Internal Server Error'),
    )

    await inviteCompanyMembers(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
