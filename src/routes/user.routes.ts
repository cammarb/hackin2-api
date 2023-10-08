import express, { Router } from 'express'
import {
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  newUser,
} from '../controllers/user.controller'

const router: Router = express.Router()

router.post('/register', newUser)
router.get('/', getAllUsers)
router.get('/:id', getUser)
router.put('/:id/edit', editUser)
router.delete('/:id/delete', deleteUser)

export default router
