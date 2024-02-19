import express, { Router } from 'express'
import {
  handleLogOut,
  handleLogin,
  handleRefreshToken,
  handleRegistration,
} from '../controllers/auth.controller'

const authRouter: Router = express.Router()

authRouter.post('/register', handleRegistration)
authRouter.post('/login', handleLogin)
authRouter.post('/logout', handleLogOut)
authRouter.get('/refresh', handleRefreshToken)

export default authRouter
