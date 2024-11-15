import { Router } from 'express'
import { allowedRoles } from '../middleware/roles.middleware'
import {
  inviteCompanyMembersController,
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
  '/invite',
  allowedRoles(['OWNER', 'ADMIN']),
  inviteCompanyMembersController
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
