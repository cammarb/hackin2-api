import express, { Router } from 'express'
import { handleLogin } from '../controllers/auth.controller'
const authRouter: Router = express.Router()

authRouter.post('/', handleLogin)

export default authRouter
