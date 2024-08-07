import { Router } from 'express'
import {
  getUsersController,
  getUserByIdController,
  editUserController,
  deleteUserController
} from './user.controller'

export const userRouter: Router = Router()

userRouter.get('/', getUsersController)
userRouter.get('/:id', getUserByIdController)
userRouter.put('/:id/edit', editUserController)
userRouter.delete('/:id/delete', deleteUserController)
