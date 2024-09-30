import { Router } from 'express'
import {
  stripeCreateAccountController,
  stripeCreateAccountLinkController,
  stripeGetCheckoutSessionController,
  stripeNewCheckoutSessionController,
  stripePaymentController,
  stripeRetrieveAccount,
  stripeTransferPentesterController
} from './payment.controller'

export const paymentRouter: Router = Router()

paymentRouter.post('/stripeAccounts/new', stripeCreateAccountController)
paymentRouter.post(
  '/stripeAccounts/link/new',
  stripeCreateAccountLinkController
)
paymentRouter.get('/stripeAccounts/:id', stripeRetrieveAccount)

paymentRouter.post('/new', stripeNewCheckoutSessionController)
paymentRouter.get('/:id', stripeGetCheckoutSessionController)
