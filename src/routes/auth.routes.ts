import { Router } from 'express'
import {
  handleLogOut,
  handleLogin,
  handleRefreshToken,
  handleRegistration,
  handleSession,
} from '../controllers/auth.controller'

const authRouter: Router = Router()

authRouter.post('/register', handleRegistration)
authRouter.post('/login', handleLogin)
authRouter.post('/logout', handleLogOut)
authRouter.get('/refresh', handleRefreshToken)
authRouter.get('/session', handleSession)

export default authRouter
