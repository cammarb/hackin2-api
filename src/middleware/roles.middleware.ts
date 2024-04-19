import { Request, Response, NextFunction } from 'express'
import { CompanyMember, CompanyRole, User } from '@prisma/client'
import prisma from '../utils/client'

const checkEnterprise = async (
  req: Request | any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const username = req.username
    const role = req.role

    if (!username || !role) {
      return res.status(400).json({ error: 'payload not provided' })
    }

    const user = await prisma.user.findUnique({
      where: { username: username },
      select: { id: true, role: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userRole = user.role
    if (role === userRole && userRole === 'ENTERPRISE') {
      const companyMember: CompanyMember | null =
        await prisma.companyMember.findUnique({
          where: { userId: user.id },
        })
      if (!companyMember) {
        return res.status(404).json({ error: 'Member not found' })
      }
      req.userId = user.id
      req.companyId = companyMember.companyId
      req.companyRole = companyMember.companyRole
      next()
    } else {
      return res.status(403)
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const allowedRoles =
  (roles: string[]) =>
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId
      const companyId = req.companyId
      const companyRole = req.companyRole

      const companyMember = await prisma.companyMember.findUnique({
        where: {
          userId: userId,
          companyId: companyId,
          companyRole: companyRole as CompanyRole,
        },
      })

      if (!companyMember) {
        return res.status(400).json({ error: 'Error getting authorization.' })
      }

      if (roles.includes(companyMember.companyRole)) {
        next()
      } else {
        return res.status(403).json({ error: 'Unauthorized' })
      }
    } catch (error) {
      console.error('Error in role middleware:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

export { checkEnterprise, allowedRoles }
