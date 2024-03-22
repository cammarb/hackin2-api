import { Request, Response } from 'express'
import { Company, CompanyMember, Role, User } from '@prisma/client'
import prisma from '../utilts/client'
import hashToken from '../utilts/hash'

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
    res.status(500).json({ message: 'Internal Server Error', error: error })
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

export const addProgram = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId
    const userId = req.userId as string
    const { name, description, location } = req.body

    const program = await prisma.program.create({
      data: {
        name: name,
        companyId: companyId,
        description: description,
        location: location,
        createdById: userId,
      },
    })
    res.status(200).json({ message: 'Program created successfully' })
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

export const getProgram = async (req: Request | any, res: Response) => {
  try {
    const programId = req.params.id

    const program = await prisma.program.findUnique({
      where: {
        id: programId,
      },
    })
    if (!program) res.status(404).json({ message: 'Program not found' })
    res.status(200).json({
      program: program,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteProgram = async (req: Request, res: Response) => {
  try {
  }
  catch(error){
    res.status(500).json({error: 'Internal Server Error'})   
  }
}
