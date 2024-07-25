import { SessionData } from 'express-session'
import prisma from '../utils/client'
import hashToken from '../utils/hash'
import { generateRandomPassword } from '../utils/passwordGenerator'
import { CompanyMember, CompanyRole, Role } from '@prisma/client'

export const getCompanyMembers = async (session: SessionData) => {
  const { user } = session
  const companyId = user.company

  const companyMembers = await prisma.companyMember.findMany({
    where: {
      companyId: companyId,
    },
    include: {
      User: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  return companyMembers
}

export const addCompanyMember = async (email: string, session: SessionData) => {
  const companyId = session.user.company
  if (!companyId) throw new Error('Missing companyId')

  const username = email.split('@')[0]
  const randomPassword = await generateRandomPassword()
  const password = await hashToken(randomPassword)

  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      firstName: '',
      lastName: '',
      password: password,
      role: 'ENTERPRISE',
    },
  })

  const companyMember: CompanyMember = await prisma.companyMember.create({
    data: {
      companyId: companyId,
      companyRole: 'MEMBER',
      userId: user.id,
    },
  })

  return companyMember
}

export const getCompanyMemberById = async (id: string) => {
  const companyMember = await prisma.companyMember.findUnique({
    where: {
      userId: id,
    },
    include: {
      User: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  return companyMember
}

export const editCompanyMember = async (id: string, role: CompanyRole) => {
  if (!Object.values(CompanyRole).includes(role))
    throw new Error('Invalid role')

  const companyRole = role as CompanyRole

  const companyMember = await prisma.companyMember.update({
    where: {
      userId: id,
    },
    data: {
      companyRole: companyRole,
    },
  })

  return companyMember
}

export const deleteCompanyMember = async (id: string) => {
  const companyMember = await prisma.companyMember.findUnique({
    where: {
      userId: id,
    },
  })

  return companyMember
}
