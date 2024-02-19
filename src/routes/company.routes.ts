import express, { Router, Request, Response } from 'express'
import {
  editCompany,
  getCompany,
  getCompanyMembers,
  inviteCompanyMembers,
} from '../controllers/company.controller'
import { allowedRoles } from '../middleware/roles.middleware'

const companyRouter: Router = express.Router()

// Dashboard
companyRouter.get('/', getCompany)

// User Management
companyRouter.get('/members', allowedRoles(['OWNER', 'ADMIN', 'MEMBER']), getCompanyMembers)
companyRouter.post('/members/invite', allowedRoles(['OWNER', 'ADMIN']), inviteCompanyMembers)
companyRouter.put('/members/:id')
companyRouter.delete('/members/:id')

// Programs
companyRouter.get('/programs', allowedRoles(['OWNER', 'ADMIN', 'MEMBER']))
companyRouter.get('/programs/:id', allowedRoles(['OWNER', 'ADMIN', 'MEMBER']))

// Settings
companyRouter.get('/settings', allowedRoles(['OWNER']), getCompany)
companyRouter.put('/settings/edit', allowedRoles(['OWNER']), editCompany)

export default companyRouter
