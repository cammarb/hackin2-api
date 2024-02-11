import express, { Router } from 'express'
import {
  getAllGigs,
  getGig,
  editGig,
  deleteGig,
  newGig,
} from '../controllers/gig.controller'
import { verifyJWT } from '../middleware/auth.middleware'
import { checkAdmin, checkManager } from '../middleware/roles.middleware'

const gigRouter: Router = express.Router()

gigRouter.post('/new', verifyJWT, checkManager, newGig)
gigRouter.get('/', verifyJWT, getAllGigs)
gigRouter.get('/:id', verifyJWT, getGig)
gigRouter.put('/:id/edit', verifyJWT, checkManager, editGig)
gigRouter.delete('/:id/delete', verifyJWT, checkManager, deleteGig)

export default gigRouter
