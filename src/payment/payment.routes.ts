import { Router } from 'express'
import {
  stripeCreateAccountController,
  stripeCreateAccountLinkController,
  stripePaymentController
} from './payment.controller'

export const paymentRouter: Router = Router()

paymentRouter.post('/createAccount', stripeCreateAccountController)
paymentRouter.post('/createAccountLink', stripeCreateAccountLinkController)
paymentRouter.post('/new', stripePaymentController)
