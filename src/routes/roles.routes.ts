import express, { Router } from 'express'
import {
  getAllRoles,
  getRole,
  editRole,
  deleteRole,
  newRole,
} from '../controllers/roles.controller'
import { verifyJWT } from '../middleware/auth.middleware'
import { checkAdmin } from '../middleware/roles.middleware'

const roleRouter: Router = express.Router()

roleRouter.post('/new', verifyJWT, checkAdmin, newRole)
roleRouter.get('/all', verifyJWT, checkAdmin, getAllRoles)
roleRouter.get('/:id', verifyJWT, checkAdmin, getRole)
roleRouter.put('/:id/edit', verifyJWT, checkAdmin, editRole)
roleRouter.delete('/:id/delete', verifyJWT, checkAdmin, deleteRole)

export default roleRouter
