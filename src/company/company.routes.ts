import { Router } from 'express'
import { editCompany, getCompany } from './company.controller'
import { allowedRoles } from '../middleware/roles.middleware'

export const companyRouter: Router = Router()

companyRouter.get('/', getCompany)
companyRouter.get('/:id', allowedRoles(['OWNER']), getCompany)
companyRouter.put('/edit', allowedRoles(['OWNER']), editCompany)
