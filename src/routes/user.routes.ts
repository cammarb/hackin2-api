import express, { Router } from 'express'
import {
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  newUser,
} from '../controllers/user.controller'

const userRouter: Router = express.Router()

userRouter.post('/register', newUser)
userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUser)
userRouter.put('/:id/edit', editUser)
userRouter.delete('/:id/delete', deleteUser)

export default userRouter
