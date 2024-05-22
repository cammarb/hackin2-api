import express, { Router, Request, Response } from 'express'
import {
  deleteMember,
  editCompany,
  editMember,
  getCompany,
  getCompanyMembers,
  getMember,
  inviteCompanyMembers,
  getCompanyPrograms,
} from '../controllers/company.controller'
import {
  getProgram,

  addProgram,
  updateProgram,
  deleteProgram,
  addScope,
  updateScope,
  getProgramScopes,
  deleteScope,
} from '../controllers/program.controller'
import {
  addBounty,
  getBounties,
  editBounty,
  getBounty,
  deleteBounty,
} from '../controllers/bounty.controller'
import { allowedRoles } from '../middleware/roles.middleware'

const companyRouter: Router = Router()

// Dashboard
companyRouter.get('/', getCompany)

// User Management
companyRouter.get(
  '/members',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getCompanyMembers,
)
companyRouter.post(
  '/members/invite',
  allowedRoles(['OWNER', 'ADMIN']),
  inviteCompanyMembers,
)
companyRouter.get(
  '/members/:id',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getMember,
)
companyRouter.put('/members/:id', allowedRoles(['OWNER']), editMember)
companyRouter.delete(
  '/members/:id',
  allowedRoles(['OWNER', 'ADMIN']),
  deleteMember,
)

// Programs
companyRouter.get(
  '/programs',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getCompanyPrograms,
)
companyRouter.post('/programs/new', allowedRoles(['OWNER']), addProgram)
companyRouter.get(
  '/programs/:id',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getProgram,
)
companyRouter.put(
  '/programs/:id',
  allowedRoles(['OWNER', 'ADMIN']),
  updateProgram,
)
companyRouter.delete(
  '/programs/:id',
  allowedRoles(['OWNER', 'ADMIN']),
  deleteProgram,
)

// Scopes
companyRouter.get(
  '/programs/:id/scope',
  getProgramScopes
)
companyRouter.post(
  '/programs/:id/scope/new',
  addScope
)
companyRouter.put(
  '/scope/:id/edit',
  updateScope
)
companyRouter.delete(
  '/scope/:id/delete',
  deleteScope
)

// Bounties
companyRouter.get(
  '/programs/:id/bounties',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getBounties,
)
companyRouter.post(
  '/programs/:id/bounties/new',
  allowedRoles(['OWNER', 'ADMIN']),
  addBounty,
)
companyRouter.put(
  '/bounty/:id/edit',
  allowedRoles(['OWNER', 'ADMIN']),
  editBounty,
)
companyRouter.get(
  '/bounty/:id',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getBounty,
)
companyRouter.delete(
  '/bounty/:id/delete',
  allowedRoles(['OWNER', 'ADMIN']),
  deleteBounty,
)

// Settings
companyRouter.get('/settings', allowedRoles(['OWNER']), getCompany)
companyRouter.put('/settings/edit', allowedRoles(['OWNER']), editCompany)

export default companyRouter
