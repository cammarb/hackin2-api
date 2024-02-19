import express, { Router } from 'express'
import { getUser, editUser, deleteUser } from '../controllers/user.controller'
import { verifyJWT } from '../middleware/auth.middleware'

const userRouter: Router = express.Router()

userRouter.get('/account', getUser)
userRouter.put('/account/edit', editUser)
userRouter.delete('/account/delete', deleteUser)

export default userRouter
