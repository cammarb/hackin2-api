import { Router } from 'express'
import {
  stripeCreateAccountController,
  stripeCreateAccountLinkController,
  stripePaymentController,
  stripeRetrieveAccount,
  stripeTransferPentesterController
} from './payment.controller'

export const paymentRouter: Router = Router()

paymentRouter.post('/createAccount', stripeCreateAccountController)
paymentRouter.post('/createAccountLink', stripeCreateAccountLinkController)
paymentRouter.post('/new', stripePaymentController)
paymentRouter.get('/:id', stripeRetrieveAccount)
paymentRouter.post('/transfer', stripeTransferPentesterController)
