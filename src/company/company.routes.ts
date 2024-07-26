import { Router } from 'express'
import {
  editCompanyController,
  getCompaniesController,
  getCompanyByIdController,
} from './company.controller'
import { allowedRoles } from '../middleware/roles.middleware'

export const companyRouter: Router = Router()

companyRouter.get('/', allowedRoles(['OWNER']), getCompaniesController)
companyRouter.get('/:id', allowedRoles(['OWNER']), getCompanyByIdController)
companyRouter.put('/:id/edit', allowedRoles(['OWNER']), editCompanyController)
