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

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountParsed,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true
    },
    on_behalf_of: pentesterStripeAccountId,
    customer: companyStripeAccountId
  })

  const newPayment = await prisma.payments.create({
    data: {
      amount: paymentIntent.amount,
      bountyId: bountyId,
      userId: userId,
      memberId: memberId,
      companyId: companyId,
      status: 'PAYED'
    }
  })

  return paymentIntent
}
