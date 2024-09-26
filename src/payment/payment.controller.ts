import type { NextFunction, Request, Response } from 'express'
import {
  stripeCreateAccountLinkService,
  stripeCreateAccountService,
  stripePaymentService
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
    console.log(body)

    const payment = await stripePaymentService(body)

    return res.send({ success: true, payment })
  } catch (error) {
    next(error)
  }
}