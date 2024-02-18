import { Request, Response } from 'express'
import { Company, CompanyMember, User, UserType } from '@prisma/client'
import prisma from '../config/db'

export const getCompany = async (req: Request, res: Response) => {
  try {
    const username: string = req.params.username
    const userType: UserType = req.params.userType as UserType

    const user: { id: string } | null = await prisma.user.findUnique({
      where: {
        username: username,
        userType: userType,
      },
      select: {
        id: true,
      },
    })
    if (!user) res.status(404).json({ error: 'User not found' })

    const company: Company | null = await prisma.company.findFirst({
      where: {
        members: {
          some: {
            userId: user?.id,
          },
        },
      },
    })

    res.status(200).json({
      company: company,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editCompany = async (req: Request, res: Response) => {
  try {
    const { companyName, companyLogo, companyURL, companyDescription } = req.body

    const username: string = req.params.username
    const userType: UserType = req.params.userType as UserType

    const user: { id: string } | null = await prisma.user.findUnique({
      where: {
        username: username,
        userType: userType,
      },
      select: {
        id: true,
      },
    })
    if (!user) res.status(404).json({ error: 'User not found' })

    const company: Company | null = await prisma.companyMember
      .findUnique({
        where: {
          userId: user?.id,
        },
      })
      .company()

    const updateCompany: Company | null = await prisma.company.update({
      where: {
        id: company?.id,
      },
      data: {
        companyName: companyName,
        companyLogo: companyLogo,
        companyURL: companyURL,
        companyDescription: companyDescription,
      },
    })

    res.status(200).json({
      company: updateCompany,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
