import express, { Router } from 'express'
import { handleLogin } from '../controllers/auth.controller'
const router: Router = express.Router()

router.post('/login', handleLogin)

export default router
