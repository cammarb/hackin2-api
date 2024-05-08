import express, { Router, Request, Response } from 'express'
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
  addBounty,
  getBounties,
  editBounty,
  getBounty,
  deleteBounty,
} from '../controllers/company.controller'
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
