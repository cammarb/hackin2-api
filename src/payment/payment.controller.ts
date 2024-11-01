import type { NextFunction, Request, Response } from 'express'
import {
  getPaymentByCheckoutSessionId,
  getPayments,
  retrieveStripeAccount,
  stripeCreateAccountLinkService,
  stripeCreateAccountService,
  stripeGetPayments,
  stripeNewCheckoutSession,
  stripeNewCustomerAccount,
  stripePaymentService,
  stripeTransferPentester
} from './payment.service'
import { stripe } from '../utils/stripe'
import type Stripe from 'stripe'
import prisma from '../utils/client'

export const stripeCreateAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body

    const account = await stripeCreateAccountService(body)

    return res.status(200).json({ account: account })
  } catch (error) {
    next(error)
  }
}

export const stripeCreateAccountLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body

    const account = await stripeCreateAccountLinkService(body)

    return res.status(200).json({ success: true, account })
  } catch (error) {
    next(error)
  }
}

export const stripePaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body

    const payment = await stripePaymentService(body)

    return res.send({ success: true, payment })
  } catch (error) {
    next(error)
  }
}

export const stripeRetrieveAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id

    const account = await retrieveStripeAccount(id)

    return res.send({ success: true, account })
  } catch (error) {
    next(error)
  }
}

export const stripeTransferPentesterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stripeAccount = req.body.stripeAccount
    const amount = req.body.amount

    const tranfer = await stripeTransferPentester(stripeAccount, amount)

    return res.send({ success: true, tranfer })
  } catch (error) {
    next(error)
  }
}

export const stripeNewCheckoutSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body

    const checkoutSession = await stripeNewCheckoutSession(body)

    // res.redirect(302, checkoutSession.url as string)
    res.status(200).json({ url: checkoutSession.url })
  } catch (error) {
    next(error)
  }
}

export const getPaymentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const checkoutSessionId = req.params.id

    const payment = await getPaymentByCheckoutSessionId(checkoutSessionId)

    return res.status(200).json({ payment: payment })
  } catch (error) {
    next(error)
  }
}

export const stripeGetPaymentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = req.query.account as string

    const sessions = await stripeGetPayments(account)

    return res.status(200).json({ sessions })
  } catch (error) {
    next(error)
  }
}

export const stripeNewCustomerAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body

    const customer = await stripeNewCustomerAccount(body)

    return res.status(200).json({ customer })
  } catch (error) {
    next(error)
  }
}

export const stripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body
    const sig = req.headers['stripe-signature'] as string
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const paymentIntentId = session.payment_intent as string
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId)

      await prisma.payments.create({
        data: {
          stripeCheckoutId: session.id as string,
          amount: paymentIntent.amount,
          companyId: session.metadata?.companyId as string,
          programId: session.metadata?.programId as string,
          memberId: session.metadata?.memberId as string,
          userId: session.metadata?.userId as string,
          bountyId: session.metadata?.bountyId as string,
          status: 'PAYED'
        }
      })

      console.log(
        `Payment recorded successfully for Checkout Session ID: ${session.id}`
      )

      await prisma.bountyAssignment.update({
        where: {
          bountyId_userId: {
            bountyId: session.metadata?.bountyId as string,
            userId: session.metadata?.userId as string
          }
        },
        data: {
          status: 'DONE'
        }
      })
    }
    return res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

export const getPaymentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query as {
      user?: string
      bounty?: string
      program?: string
    }

    const payments = await getPayments(query)
    return res.status(200).json({ payments: payments })
  } catch (error) {
    next(error)
  }
}
