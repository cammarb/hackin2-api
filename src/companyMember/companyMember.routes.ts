import { Router } from 'express'
import { allowedRoles } from '../middleware/roles.middleware'
import {
  addCompanyMembersController,
  deleteCompanyMemberController,
  editCompanyMemberController,
  getCompanyMemberByIdController,
  getCompanyMembersController
} from './companyMember.controller'

export const companyMemberRouter: Router = Router()

companyMemberRouter.get(
  '/',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getCompanyMembersController
)
companyMemberRouter.post(
  '/new',
  allowedRoles(['OWNER', 'ADMIN']),
  addCompanyMembersController
)
companyMemberRouter.get(
  '/:id',
  allowedRoles(['OWNER', 'ADMIN', 'MEMBER']),
  getCompanyMemberByIdController
)
companyMemberRouter.put(
  '/:id',
  allowedRoles(['OWNER']),
  editCompanyMemberController
)
companyMemberRouter.delete(
  '/:id',
  allowedRoles(['OWNER', 'ADMIN']),
  deleteCompanyMemberController
)
