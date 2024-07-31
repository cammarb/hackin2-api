import { Router } from 'express'
import {
  handleLogOut,
  handleLogin,
  handleRefreshToken,
  registrationController,
  handleSession,
  validateOTP,
} from './auth.controller'
import {
  validateBody,
  ValidationCriteria,
} from '../middleware/params.middleware'
import { NewUserBody } from '../user/user.dto'

export const authRouter: Router = Router()

authRouter.post('/login', handleLogin)
authRouter.post(
  '/register',
  validateBody<NewUserBody>(
    ['firstName', 'lastName', 'email', 'username', 'role', 'password'],
    ValidationCriteria.ALL,
  ),
  registrationController,
)
authRouter.post('/logout', handleLogOut)
authRouter.get('/refresh', handleRefreshToken)
authRouter.get('/session', handleSession)
authRouter.get('/validateOTP', validateOTP)
