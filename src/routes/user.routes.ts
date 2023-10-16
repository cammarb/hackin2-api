import express, { Router } from 'express'
import {
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  newUser,
} from '../controllers/user.controller'
import { verifyJWT } from '../middleware/verifyJWT'

const userRouter: Router = express.Router()

userRouter.post('/register', newUser)
userRouter.get('/', verifyJWT, getAllUsers)
userRouter.get('/:id', getUser)
userRouter.put('/:id/edit', editUser)
userRouter.delete('/:id/delete', deleteUser)

export default userRouter
