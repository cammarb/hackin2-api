import express, { Router } from 'express'
import { handleLogin, handleRefreshToken } from '../controllers/auth.controller'
const authRouter: Router = express.Router()

authRouter.post('/', handleLogin)
authRouter.post('/refresh', handleRefreshToken)

export default authRouter
