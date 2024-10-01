import { Router } from 'express'
import {
  stripeCreateAccountController,
  stripeCreateAccountLinkController,
  stripeGetCheckoutSessionController,
  stripeGetPaymentsController,
  stripeNewCheckoutSessionController,
  stripeNewCustomerAccountController,
  stripePaymentController,
  stripeRetrieveAccount,
  stripeTransferPentesterController
} from './payment.controller'
import {
  validateBody,
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

paymentRouter.post(
  '/new',
  validateBody(
    ['companyId', 'userId', 'amount', 'programId', 'bountyId'],
    ValidationCriteria.ALL
  ),
  stripeNewCheckoutSessionController
)
paymentRouter.get('/:id', stripeGetCheckoutSessionController)
paymentRouter.get('/', stripeGetPaymentsController)
