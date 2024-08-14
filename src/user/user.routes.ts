import { Router } from 'express'
import {
  getUsersController,
  getUserByIdController,
  editUserController,
  deleteUserController,
  editUserPasswordController
} from './user.controller'
import { checkSession } from '../auth/auth.middleware'

export const userRouter: Router = Router()

userRouter.get('/', getUsersController)
userRouter.get('/:id', checkSession, getUserByIdController)
userRouter.put('/:id/edit', editUserController)
userRouter.patch('/:id/change-password', editUserPasswordController)
userRouter.delete('/:id/delete', deleteUserController)
