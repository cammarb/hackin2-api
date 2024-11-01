import { Router } from 'express'
import {
  getPaymentByIdController,
  getPaymentsController,
  stripeCreateAccountController,
  stripeCreateAccountLinkController,
  stripeGetPaymentsController,
  stripeNewCheckoutSessionController,
  stripeNewCustomerAccountController,
  stripeRetrieveAccount
} from './payment.controller'
import {
  validateBody,
  validateQuery,
  ValidationCriteria
} from '../middleware/params.middleware'

export const paymentRouter: Router = Router()

/**Connected Accounts in this context will be assigned
 * to users with PENTESTER role.
 * Customers will be assigned to ENTERPRISE users.
 *
 * This is because connected accounts should be able
 * to retrieve money to their preffered accounts
 * and customers should only be able to pay directly
 * to the connected accounts.
 */
paymentRouter.post(
  '/stripeConnectedAccounts/new',
  stripeCreateAccountController
)
paymentRouter.post(
  '/stripeConnectedAccounts/link/new',
  stripeCreateAccountLinkController
)
paymentRouter.get('/stripeConnectedAccounts/:id', stripeRetrieveAccount)

paymentRouter.post('/stripeCustomer/new', stripeNewCustomerAccountController)
paymentRouter.get('/stripeCustomer/:id', stripeRetrieveAccount)
paymentRouter.get('/stripeCustomer', stripeGetPaymentsController)

paymentRouter.post(
  '/new',
  validateBody(
    ['companyId', 'memberId', 'userId', 'amount', 'programId', 'bountyId'],
    ValidationCriteria.ALL
  ),
  stripeNewCheckoutSessionController
)
paymentRouter.get('/checkoutSession/:id', getPaymentByIdController)
paymentRouter.get(
  '/',
  validateQuery(['user', 'bounty', 'program'], ValidationCriteria.AT_LEAST_ONE),
  getPaymentsController
)
