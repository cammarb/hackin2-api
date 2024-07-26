import { Router } from 'express'
import {
  handleLogOut,
  handleLogin,
  handleRefreshToken,
  handleRegistration,
  handleSession,
  validateOTP,
} from './auth.controller'

export const authRouter: Router = Router()

authRouter.post('/login', handleLogin)
authRouter.post('/register', handleRegistration)
authRouter.post('/logout', handleLogOut)
authRouter.get('/refresh', handleRefreshToken)
authRouter.get('/session', handleSession)
authRouter.get('/validateOTP', validateOTP)
