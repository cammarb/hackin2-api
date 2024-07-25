import { Router } from 'express'
import {
  editProgramController,
  getProgramByIdController,
  getProgramsController,
} from './program.controller'
import { checkEnterprise } from '../middleware/roles.middleware'

export const programRouter: Router = Router()

programRouter.get('/', getProgramsController)
programRouter.get('/:id', getProgramByIdController)
programRouter.put('/:id/edit', checkEnterprise, editProgramController)
