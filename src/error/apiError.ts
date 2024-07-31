export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class InternalServerError extends ApiError {
  constructor() {
    super('Internal Server Error', 500)
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}

export class MissingParameterError extends BadRequestError {
  constructor(parameter: string) {
    super(`Missing required parameter: ${parameter}`)
    Object.setPrototypeOf(this, MissingParameterError.prototype)
  }
}

export class InvalidParameterError extends BadRequestError {
  constructor(parameter: string) {
    super(`Invalid parameter: ${parameter}`)
    Object.setPrototypeOf(this, InvalidParameterError.prototype)
  }
}

export class MissingBodyParameterError extends BadRequestError {
  constructor(parameter: string) {
    super(`Missing required body parameter: ${parameter}`)
    Object.setPrototypeOf(this, MissingBodyParameterError.prototype)
  }
}

export class ResourceNotFoundError extends NotFoundError {
  constructor(resource?: string) {
    super(`Resource not found ${resource ? resource : ''}`)
    Object.setPrototypeOf(this, MissingBodyParameterError.prototype)
  }
}
