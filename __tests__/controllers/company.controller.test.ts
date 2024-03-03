import { Request, Response } from 'express'
import { getCompany } from '../../src/controllers/company.controller'
import prisma from '../../src/config/db'

interface CustomRequest extends Request {
  companyId?: string
}

const mockRequest = (): CustomRequest => {
  const req: Partial<CustomRequest> = {}
  req.companyId = '1'
  return req as CustomRequest
}

const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  }
  return res as Response
}

describe('getCompany', () => {
  it('should return company details', async () => {
    const req = mockRequest()
    const res = mockResponse()

    await getCompany(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: expect.stringContaining('Welcome to Company'),
    })
  })

  it('should handle errors', async () => {
    const req = mockRequest()
    const res = mockResponse()

    jest
      .spyOn(prisma.company, 'findUnique')
      .mockRejectedValueOnce(new Error('Database Error'))

    await getCompany(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
