import { Role } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import prisma from '../config/db'

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const roleId = req.params.roleId

  if (!roleId) return res.sendStatus(401)
  const role: Role | null = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  })
  if (!role) res.status(404).json({ error: 'Role not found' })

  try {
    const roleName = role?.name
    if (roleName == 'admin') next()
  } catch (error: any) {
    res.sendStatus(403)
  }
}

export { checkAdmin }
