import type { NextFunction, Request, Response } from 'express'
import {
  retrieveStripeAccount,
  stripeCreateAccountLinkService,
  stripeCreateAccountService,
  stripeGetCheckoutSession,
  stripeGetPayments,
  stripeNewCheckoutSession,
  stripePaymentService,
  stripeTransferPentester
} from './payment.service'

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
    const enterpriseStripeAccount = req.body.enterpriseStripeAccount
    const pentesterStripeAccount = req.body.pentesterStripeAccount
    const amount = req.body.amount

    const checkoutSession = await stripeNewCheckoutSession(
      enterpriseStripeAccount,
      pentesterStripeAccount,
      amount
    )

    // res.redirect(checkoutSession.url as string)
    return res.send({ checkoutSession })
  } catch (error) {
    next(error)
  }
}

export const stripeGetCheckoutSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.params.id

    const checkoutSession = await stripeGetCheckoutSession(sessionId)

    return res.status(200).json({ checkoutSession })
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
