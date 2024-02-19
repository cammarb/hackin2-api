import { Request, Response } from 'express'
import { Company, CompanyMember, Role, User } from '@prisma/client'
import prisma from '../config/db'
import hashToken from '../config/hash'

export const getCompany = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        name: true,
      },
    })
    res.status(200).json({
      message: `Welcome to Company ${company?.name}.`,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editCompany = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId
    const { newName, newOwner } = req.body

    const company: Company | null = await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        name: newName,
        ownerId: newOwner,
      },
    })

    res.status(200).json({
      company,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getCompanyMembers = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        CompanyMember: true,
      },
    })
    res.status(200).json({
      Members: company?.CompanyMember,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const inviteCompanyMembers = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId
    console.log(companyId)
    const memberEmail = req.body.email
    const username = memberEmail.split('@')[0]
    const password = await hashToken('test')

    const user = await prisma.user.create({
      data: {
        username: username,
        email: memberEmail,
        firstName: '',
        lastName: '',
        password: password,
        role: 'ENTERPRISE',
      },
      select: {
        id: true,
        email: true,
      },
    })
    const companyMember: CompanyMember = await prisma.companyMember.create({
      data: {
        companyId: companyId,
        companyRole: 'MEMBER',
        userId: user.id,
      },
    })
    res.status(200).json({ message: `Invitation sent to ${user.email}.` })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error })
  }
}
