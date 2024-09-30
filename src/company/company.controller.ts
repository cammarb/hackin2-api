import type { NextFunction, Request, Response } from 'express'
import { editCompany, getCompanies, getCompanyById } from './company.service'

export const newCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await getCompanies()

    if (!company) return res.status(404).json({ error: 'Resource not found' })

    return res.status(200).json({ company: company })
  } catch (error) {
    next(error)
  }
}

export const getCompaniesController = async (req: Request, res: Response) => {
  try {
    const companies = await getCompanies()

    if (!companies) return res.status(404).json({ error: 'Resource not found' })

    return res.status(200).json({ companies: companies })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getCompanyByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    if (!id)
      return res.status(400).json({ error: 'Missing request params or body' })

    const company = await getCompanyById(id)

    if (!company) return res.status(404).json({ error: 'Resource not found' })

    return res.status(200).json({
      message: `Welcome to Company ${company?.name}.`
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editCompanyController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const body = req.body

    if (!id || !body)
      return res
        .status(400)
        .json({ error: 'Missing request parameters or body' })

    const company = await editCompany(id, body)

    return res.status(200).json({
      company
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
