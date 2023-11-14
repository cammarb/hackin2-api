import express, { Router } from 'express'
import {
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  newUser,
} from '../controllers/user.controller'
import { verifyJWT } from '../middleware/auth.middleware'

const userRouter: Router = express.Router()

userRouter.post('/register', newUser)
userRouter.get('/', verifyJWT, getAllUsers)
userRouter.get('/account', verifyJWT, getUser)
userRouter.put('/account/edit', verifyJWT, editUser)
userRouter.delete('/account/delete', verifyJWT, deleteUser)

export default userRouter
