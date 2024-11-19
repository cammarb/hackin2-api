import { Router } from 'express'
import {
  addScopeController,
  deleteScopeController,
  getScopesController,
  updateScopeController
} from './scope.controller'
import {
  validateQuery,
  ValidationCriteria
} from '../middleware/params.middleware'

export const scopeRouter: Router = Router()

scopeRouter.get('/', getScopesController)
scopeRouter.post(
  '/new',
  validateQuery(['program'], ValidationCriteria.ALL),
  addScopeController
)
scopeRouter.get('/:id', updateScopeController)
scopeRouter.put('/:id/edit', updateScopeController)
scopeRouter.delete('/:id/delete', deleteScopeController)
