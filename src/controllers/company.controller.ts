import { Request, Response } from 'express'
import { Company, CompanyMember, Prisma } from '@prisma/client'
import prisma from '../utils/client'
import hashToken from '../utils/hash'

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
    const { newName } = req.body

    const company: Company | null = await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        name: newName,
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
        CompanyMember: {
          include: {
            User: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })
    res.status(200).json({
      members: company?.CompanyMember,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const inviteCompanyMembers = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const companyId = req.companyId
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
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getMember = async (req: Request | any, res: Response) => {
  try {
    const memberId = req.params.id
    const companyId = req.companyId as string

    const companyMember = await prisma.companyMember.findUnique({
      where: {
        companyId: companyId,
        userId: memberId,
      },
    })
    res.status(200).json({
      Member: companyMember,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editMember = async (req: Request | any, res: Response) => {
  try {
    const memberId = req.params.id
    const companyId = req.companyId as string
    const { companyRole } = req.body

    const companyMember = await prisma.companyMember.update({
      where: {
        companyId: companyId,
        userId: memberId,
      },
      data: {
        companyRole: companyRole,
      },
    })
    res.status(200).json({
      Member: companyMember,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteMember = async (req: Request | any, res: Response) => {
  try {
    const memberId = req.params.id
    const companyId = req.companyId as string

    const companyMember = await prisma.companyMember.findUnique({
      where: {
        companyId: companyId,
        userId: memberId,
      },
    })
    res.status(200).json({
      message: `Member with id:${companyMember?.userId} was successfully removed.`,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getCompanyPrograms = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId as string

    const programs = await prisma.program.findMany({
      where: {
        companyId: companyId,
      },
    })
    res.status(200).json({
      programs,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}