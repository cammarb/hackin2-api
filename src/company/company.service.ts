import { Company } from '@prisma/client'
import prisma from '../utils/client'
import { EditCompanyBody } from './company.dto'

export const getCompanies = async () => {
  const companies = await prisma.company.findMany()

  return companies
}

export const getCompanyById = async (id: string) => {
  const companyId = id
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  })

  return company
}

export const editCompany = async (id: string, body: EditCompanyBody) => {
  const companyId = id
  const { website } = body

  const company: Company | null = await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      website: website,
    },
  })

  return company
}
