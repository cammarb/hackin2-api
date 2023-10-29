import express, { Router } from 'express'
import { handleRefreshToken } from '../controllers/refreshToken.controller'
const refreshRouter: Router = express.Router()

refreshRouter.post('/', handleRefreshToken)

export default refreshRouter
