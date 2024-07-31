import { Request, Response } from 'express'
import morgan from 'morgan'

export const logger = () => {
  morgan.token('id', (req: Request) => req.id || '-')
  morgan.token('status', (req: Request, res: Response) =>
    res.statusCode.toString(),
  )
  morgan.token('error', (req: Request, res: Response) => req.err || 'null')

  morgan.format('custom', (tokens, req: Request, res: Response) => {
    const id = req.id
    const time = tokens['date'](req, res, 'clf')
    const method = tokens.method(req, res)
    const url = tokens.url(req, res)
    const status = tokens.status(req, res)
    const error = tokens.error(req, res)

    return `${time} INFO req_id=${id} method=${method} request=${url} status=${status} error=(${error})`
  })

  return morgan('custom')
}
