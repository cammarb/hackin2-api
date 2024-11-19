import type { Request, Response, NextFunction } from 'express'
import { checkEnterprise } from '../../middleware/roles.middleware'
import { allowedRoles } from '../../middleware/roles.middleware'
import { prismaMock } from '../__mocks__/prismaMock'
import { CompanyRole, Role } from '@prisma/client'
import { ResourceNotFoundError } from '../../error/apiError'
import type { Session, SessionData } from 'express-session'

describe('CheckEnterprise middleware function', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeAll(() => {
    req = {
      session: {
        user: {
          logged_in: true,
          id: '1',
          username: 'user.username',
          role: Role.ENTERPRISE,
          company: {
            id: '1',
            role: CompanyRole.ADMIN
          }
        } as SessionData['user']
      } as Session & Partial<SessionData>
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
  })

  test('When user is not found', async () => {
    const user = {
      id: '1',
      username: 'username',
      email: 'test@email.com',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      password: 'testPassword',
      role: Role.ENTERPRISE,
      mfa: false,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeAccountId: 'testStripeAccountId'
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(null)

    await checkEnterprise(req, res as Response, next)
    expect(next).toHaveBeenCalledWith(new ResourceNotFoundError())
  })

  test('When user belongs to a Company', async () => {
    const user = {
      id: '1',
      username: 'username',
      email: 'test@email.com',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      password: 'testPassword',
      role: Role.ENTERPRISE,
      mfa: false,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeAccountId: 'testStripeAccountId'
    }
    const companyMember = {
      userId: '1',
      companyId: '1',
      companyRole: CompanyRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.companyMember.findUnique.mockResolvedValue(companyMember)

    await checkEnterprise(req, res as Response, next)
    expect(next).toHaveBeenCalled()
    expect(req.session?.user).toBeDefined()
    expect(req.session?.user?.id).toBe('1')
    expect(req.session?.user?.company?.id).toBe('1')
    expect(req.session?.user?.company?.role).toBe('ADMIN')
  })

  test('When the role is other than ENTERPRISE', async () => {
    const user = {
      id: '1',
      username: 'username',
      email: 'test@email.com',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      password: 'testPassword',
      role: Role.PENTESTER,
      mfa: false,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeAccountId: 'testStripeAccountId'
    }
    prismaMock.user.findUnique.mockResolvedValue(user)

    await checkEnterprise(req, res as Response, next)
    expect(next).toHaveBeenCalled()
  })
})

describe('allowedRoles middleware function', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeAll(() => {
    req = {
      session: {
        user: {
          logged_in: true,
          id: '1',
          username: 'user.username',
          role: Role.ENTERPRISE,
          company: {
            id: '1',
            role: CompanyRole.ADMIN
          }
        } as SessionData['user']
      } as Session & Partial<SessionData>
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
  })

  test('When the role of the user is allowed', async () => {
    const companyMember = {
      userId: '1',
      companyId: '1',
      companyRole: CompanyRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    prismaMock.companyMember.findUnique.mockResolvedValue(companyMember)

    const middleware = allowedRoles([CompanyRole.ADMIN])
    await middleware(req, res as Response, next)
    expect(next).toHaveBeenCalled()
  })

  test('When the role is not allowed', async () => {
    const companyMember = {
      userId: '1',
      companyId: '1',
      companyRole: CompanyRole.MEMBER,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    prismaMock.companyMember.findUnique.mockResolvedValue(companyMember)

    const middleware = allowedRoles([CompanyRole.ADMIN])
    await middleware(req, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.statusMessage).toHaveBeenCalledWith({
      error: 'Unauthorized'
    })
  })

  test('When companyMember cannot be found', async () => {
    prismaMock.companyMember.findUnique.mockResolvedValue(null)

    const middleware = allowedRoles([CompanyRole.ADMIN])
    await middleware(req, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.statusMessage).toHaveBeenCalledWith({
      error: 'Error getting authorization.'
    })
  })
})
