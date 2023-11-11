import express, { Router } from 'express'
import {
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  newUser,
} from '../controllers/user.controller'
import { verifyJWT } from '../middleware/auth.middelware'

const userRouter: Router = express.Router()

userRouter.post('/register', newUser)
userRouter.get('/', verifyJWT, getAllUsers)
userRouter.get('/:id', verifyJWT, getUser)
userRouter.put('/:id/edit', verifyJWT, editUser)
userRouter.delete('/:id/delete', verifyJWT, deleteUser)

export default userRouter
