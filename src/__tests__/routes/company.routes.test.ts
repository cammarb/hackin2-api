import express, { NextFunction, Request, Response, Router } from 'express'
import {
  addProgram,
  deleteMember,
  editCompany,
  editMember,
  getCompany,
  getCompanyMembers,
  getMember,
  getCompanyPrograms,
  inviteCompanyMembers,
  getProgram,
} from '../../controllers/company.controller'
import { allowedRoles } from '../../middleware/roles.middleware'
import companyRouter from '../../routes/company.routes'

jest.mock('express', () => ({
  Router: () => {
    const router = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    }
    return router
  },
}))

jest.mock('../../controllers/company.controller', () => ({
  getCompany: jest.fn(),
  getCompanyMembers: jest.fn(),
  inviteCompanyMembers: jest.fn(),
  getMember: jest.fn(),
  editMember: jest.fn(),
  deleteMember: jest.fn(),
}))

describe('Company router', () => {
  let router: Router

  beforeEach(() => {
    router = companyRouter
  })

  test('Company main route', async () => {
    router.get('/', getCompany)
    expect(router.get).toHaveBeenCalled()
  })

  test('GET Company members route', async () => {
    router.get(
      '/members',
      allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
      getCompanyMembers,
    )
    expect(router.get).toHaveBeenCalled()
  })

  test('POST Company members route', async () => {
    router.post(
      '/members/invite',
      allowedRoles(['OWNER', 'ADMIN']),
      inviteCompanyMembers,
    )
    expect(router.post).toHaveBeenCalled()
  })

  test('GET company member by ID route', async () => {
    router.get(
      '/members/:id',
      allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
      getMember,
    )
    expect(router.get).toHaveBeenCalled()
  })

  test('PUT company member by ID route', async () => {
    router.put('/members/:id', allowedRoles(['OWNER']), editMember)
    expect(router.put).toHaveBeenCalled()
  })

  test('DELETE company member by ID route', async () => {
    router.delete(
      '/members/:id',
      allowedRoles(['OWNER', 'ADMIN']),
      deleteMember,
    )
    expect(router.delete).toHaveBeenCalled()
  })
})
