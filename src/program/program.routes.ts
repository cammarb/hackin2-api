import { Router } from 'express'
import {
  validateBody,
  validateParams,
  validateQuery,
  ValidationCriteria
} from '../middleware/params.middleware'
import { checkEnterprise } from '../middleware/roles.middleware'
import {
  addProgramController,
  deleteProgramController,
  editProgramController,
  getProgramByIdController,
  getProgramsController
} from './program.controller'
import type {
  NewProgramBody,
  NewProgramQuery,
  ProgramQueryParams,
  UpdateProgramBody
} from './program.dto'

export const programRouter: Router = Router()

programRouter.get(
  '/',
  validateQuery<ProgramQueryParams>(['company', 'status']),
  getProgramsController
)
programRouter.post(
  '/new',
  validateQuery<NewProgramQuery>(['company'], ValidationCriteria.ALL),
  validateBody<NewProgramBody>(
    ['name', 'location', 'description'],
    ValidationCriteria.ALL
  ),
  addProgramController
)
programRouter.get(
  '/:id',
  validateParams(['id'], ValidationCriteria.ALL),
  getProgramByIdController
)
programRouter.put(
  '/:id/edit',
  checkEnterprise,
  validateParams(['id'], ValidationCriteria.ALL),
  validateBody<UpdateProgramBody>(
    ['name', 'description', 'location', 'programStatus'],
    ValidationCriteria.AT_LEAST_ONE
  ),
  editProgramController
)
programRouter.put(
  '/:id/edit',
  checkEnterprise,
  validateParams(['id'], ValidationCriteria.ALL),
  deleteProgramController
)
