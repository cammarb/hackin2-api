import type { NextFunction, Request, Response } from 'express'
import {
  retrieveStripeAccount,
  stripeCreateAccountLinkService,
  stripeCreateAccountService,
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
