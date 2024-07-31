import { NextFunction, Request, Response } from 'express'
import {
  InvalidParameterError,
  MissingBodyParameterError,
  MissingParameterError,
} from '../error/apiError'

export enum ValidationCriteria {
  ALL,
  AT_LEAST_ONE,
}

/**
 * Middleware to validate the presence of required parameters in the request.
 *
 * @param allowedParams - An array of allowed parameters.
 * @param criteria - Specifies whether all of the parameters are required or if at least one is required.
 */
export const validateParams = <T>(
  allowedParams: (keyof T)[],
  criteria?: ValidationCriteria,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const params = req.params

    const unexpectedParams = Object.keys(params).filter(
      (param) => !allowedParams.includes(param as keyof T),
    )

    if (unexpectedParams.length > 0) {
      return next(new InvalidParameterError(unexpectedParams.join(', ')))
    }

    if (criteria === ValidationCriteria.ALL) {
      const missingFields = allowedParams.filter((field) => !(field in params))
      if (missingFields.length > 0) {
        return next(new MissingBodyParameterError(missingFields.join(', ')))
      }
    } else if (criteria === ValidationCriteria.AT_LEAST_ONE) {
      const hasRequiredField = allowedParams.some((field) => field in params)
      if (!hasRequiredField) {
        return next(new MissingBodyParameterError(allowedParams.join(', ')))
      }
    }
    next()
  }
}

/**
 * Middleware to validate the presence of required query parameters in the request.
 *
 * @param allowedQuery - An array of query string keys that need to be checked.
 * @param criteria - Specifies whether all of the query parameters are required or if at least one is required.
 */
export const validateQuery = <T>(
  allowedQuery: (keyof T)[],
  criteria?: ValidationCriteria,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const query = req.query

    const unexpectedParams = Object.keys(query).filter(
      (param) => !allowedQuery.includes(param as keyof T),
    )
    if (unexpectedParams.length > 0) {
      return next(new InvalidParameterError(unexpectedParams.join(', ')))
    }

    if (criteria === ValidationCriteria.ALL) {
      const missingFields = allowedQuery.filter((field) => !(field in query))
      if (missingFields.length > 0) {
        return next(new MissingParameterError(missingFields.join(', ')))
      }
    } else if (criteria === ValidationCriteria.AT_LEAST_ONE) {
      const hasRequiredField = allowedQuery.some((field) => field in query)
      if (!hasRequiredField) {
        return next(new MissingParameterError(allowedQuery.join(', ')))
      }
    }
    next()
  }
}

/**
 * Middleware to validate the presence of key-value pairs in the request body.
 *
 * @param requiredFields - An array of fields that need to be checked.
 * @param criteria - Specifies whether all of the query parameters are required or if at least one is required.
 */
export const validateBody = <T extends object>(
  requiredFields: (keyof T)[],
  criteria?: ValidationCriteria,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const body: T = req.body

    if (criteria === ValidationCriteria.ALL) {
      const missingFields = requiredFields.filter((field) => !(field in body))
      if (missingFields.length > 0) {
        return next(new MissingBodyParameterError(missingFields.join(', ')))
      }
    } else if (criteria === ValidationCriteria.AT_LEAST_ONE) {
      const hasRequiredField = requiredFields.some((field) => field in body)
      if (!hasRequiredField) {
        return next(new MissingBodyParameterError(requiredFields.join(', ')))
      }
    }
    next()
  }
}

/**
 * Middleware to validate the presence of cookies
 *
 * @param cookie - An array of cookies that need to be checked.
 */
export const validateCookies = (
  cookie: string[],
  criteria?: ValidationCriteria,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies

    if (criteria === ValidationCriteria.ALL) {
      const missingFields = cookie.filter((field) => !(field in cookies))
      if (missingFields.length > 0) {
        return next(new MissingBodyParameterError(missingFields.join(', ')))
      }
    } else if (criteria === ValidationCriteria.AT_LEAST_ONE) {
      const hasRequiredField = cookie.some((field) => field in cookie)
      if (!hasRequiredField) {
        return next(new MissingBodyParameterError(cookie.join(', ')))
      }
    }
    next()
  }
}
