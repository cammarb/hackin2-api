import express, { Router } from 'express'
import {
  getAllRoles,
  getRole,
  editRole,
  deleteRole,
  newRole,
} from '../controllers/roles.controller'
import { verifyJWT } from '../middleware/auth.middleware'

const roleRouter: Router = express.Router()

roleRouter.post('/new', verifyJWT, newRole)
roleRouter.get('/all', verifyJWT, getAllRoles)
roleRouter.get('/:id', verifyJWT, getRole)
roleRouter.put('/:id/edit', verifyJWT, editRole)
roleRouter.delete('/:id/delete', verifyJWT, deleteRole)
