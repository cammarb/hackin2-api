import { Router } from 'express'
import {
  addScopeController,
  deleteScopeController,
  getScopesController,
  updateScopeController,
} from './scope.controller'

export const scopeRouter: Router = Router()

scopeRouter.get('/', getScopesController)
scopeRouter.post('/new', addScopeController)
scopeRouter.get('/:id', updateScopeController)
scopeRouter.put('/:id/edit', updateScopeController)
scopeRouter.delete('/:id/delete', deleteScopeController)
