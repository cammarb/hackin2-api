import type { StripeAccountBody, StripePaymentBody } from './payment.dto'
import { stripe } from '../utils/stripe'
import prisma from '../utils/client'

export const stripeCreateAccountService = async (body: {
  email: string
  userId: string
}) => {
  const { email, userId } = body

  const account = await stripe.accounts.create({
    type: 'express',
    country: 'DE',
    email: email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    }
  })

  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      stripeAccountId: account.id
    }
  })

  return user
}

export const stripeCreateAccountLinkService = async (
  body: StripeAccountBody
) => {
  const { accountId } = body

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: 'http://localhost:8000/api/v1/payments/createAccountLink',
    return_url: 'http://localhost:8000/api/v1',
    type: 'account_onboarding'
  })

  return accountLink
}

export const stripePaymentService = async (body: StripePaymentBody) => {
  const {
    bountyId,
    userId,
    pentesterStripeAccountId,
    amount,
    memberId,
    companyId,
    companyStripeAccountId
  } = body
  const amountParsed = Number.parseInt(amount)

  return 0
}

export const retrieveStripeAccount = async (stripeAccount: string) => {
  const account = await stripe.accounts.retrieve(stripeAccount)

  return account
}

export const stripeTransferPentester = async (
  pentesterStripeAccount: string,
  onBehafOfEnterpriseStripeAccount: string,
  amount: number
) => {
  const transfer = await stripe.transfers.create({
    amount: amount,
    currency: 'eur',
    destination: pentesterStripeAccount
  })

  return transfer
}

export const stripeNewCheckoutSession = async (
  enterpriseStripeAccount: string,
  pentesterStripeAccount: string,
  amount: number
) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    client_reference_id: enterpriseStripeAccount,
    customer: enterpriseStripeAccount,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Bounty Payment'
          },
          unit_amount: amount
        },
        quantity: 1
      }
    ],
    payment_intent_data: {
      transfer_data: {
        destination: pentesterStripeAccount
      }
    },
    success_url: `http://localhost:${process.env.PORT}/api/v1/payments/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect URL after success
    cancel_url: `http://localhost:${process.env.PORT}/api/v1/payments/cancel` // Redirect URL if user cancels
  })

  return session
}

export const stripeGetCheckoutSession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  return session
}

export const stripeGetPayments = async (account: string) => {
  const session = await stripe.checkout.sessions.list({ customer: account })

  return session
}
