import type { Company } from '@prisma/client'
import prisma from '../utils/client'
import type { EditCompanyBody } from './company.dto'
import { stripeNewCustomerAccount } from '../payment/payment.service'

export const newCompany = async (body: {
  name: string
  website: string
  email: string
  stripeAccountId: string
}) => {
  const { name, website, email, stripeAccountId } = body

  const customerAccount = await stripeNewCustomerAccount({ email, name })

  const company = await prisma.company.create({
    data: {
      name: name,
      email: email,
      website: website,
      stripeAccountId: customerAccount.id
    }
  })

  return company
}

export const getCompanies = async () => {
  const companies = await prisma.company.findMany()

  return companies
}

export const getCompanyById = async (id: string) => {
  const companyId = id
  const company = await prisma.company.findUnique({
    where: {
      id: companyId
    }
  })

  return company
}

export const editCompany = async (id: string, body: EditCompanyBody) => {
  const companyId = id
  const { website } = body

  const company: Company | null = await prisma.company.update({
    where: {
      id: companyId
    },
    data: {
      website: website
    }
  })

  return company
}
