import { Router } from 'express'
import { getUser, editUser, deleteUser } from '../controllers/user.controller'
import { verifyJWT } from '../middleware/auth.middleware'

const userRouter: Router = Router()

userRouter.get('/account', verifyJWT, getUser)
userRouter.put('/account/edit', editUser)
userRouter.delete('/account/delete', deleteUser)

export default userRouter
