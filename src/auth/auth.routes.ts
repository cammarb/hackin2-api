import { Router } from 'express'
import {
  validateBody,
  validateCookies,
  ValidationCriteria
} from '../middleware/params.middleware'
import { LoginUserBody, NewUserBody } from '../user/user.dto'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registrationController,
  sessionController,
  validateOTP,
} from './auth.controller'

export const authRouter: Router = Router()

authRouter.post(
  '/login',
  validateBody<LoginUserBody>(['username', 'password'], ValidationCriteria.ALL),
  loginController,
)
authRouter.post(
  '/register',
  validateBody<NewUserBody>(
    ['firstName', 'lastName', 'email', 'username', 'role', 'password'],
    ValidationCriteria.ALL,
  ),
  registrationController,
)
authRouter.get(
  '/refresh',
  validateCookies(['jwt'], ValidationCriteria.ALL),
  refreshTokenController,
)
authRouter.post('/logout', logoutController)
authRouter.get('/session', sessionController)
authRouter.get('/validateOTP', validateOTP)
