import * as EmailValidator from 'email-validator'
import { InvalidParameterError } from '../error/apiError'

export const validateEmail = async (email: string) => {
  if (!EmailValidator.validate(email)) throw new InvalidParameterError(email)
}
