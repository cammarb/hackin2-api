import { Router } from 'express'
import {
  getUsersController,
  getUserByIdController,
  editUserController,
  deleteUserController
} from './user.controller'
import { checkSession } from '../auth/auth.middleware'

export const userRouter: Router = Router()

userRouter.get('/', getUsersController)
userRouter.get('/:id', checkSession, getUserByIdController)
userRouter.put('/:id/edit', editUserController)
userRouter.delete('/:id/delete', deleteUserController)
