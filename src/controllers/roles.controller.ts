import { Request, Response } from 'express'
import prisma from '../config/db'
import { Role } from '@prisma/client'

export const newRole = async (req: Request, res: Response) => {
  const roleName: string = req.body.roleName
  if (!roleName)
    return res.status(400).json({ messaege: 'All the fields are required' })

  const role: Role | null = await prisma.role.findUnique({
    where: {
      name: roleName,
    },
  })
  if (role == null) return res.sendStatus(409)
  try {
    const newRole: Role = await prisma.role.create({
      data: {
        name: roleName,
      },
    })
    res.status(201).json({ success: 'Role created successfully' })
  } catch (err: Error | any) {
    res.status(500).json({ message: err?.message })
  }
}

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles: Role[] = await prisma.role.findMany()
    res.status(200).json({
      roles,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getRole = async (req: Request, res: Response) => {
  try {
    const roleName: string = req.params.roleName
    const roleId: string = req.params.roleId

    const role: Role | null = await prisma.role.findUnique({
      where: {
        name: roleName,
        id: roleId,
      },
    })
    if (!role) res.status(404).json({ error: 'Role not found' })
    res.status(200).json({
      id: role?.id,
      name: role?.name,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editRole = async (req: Request, res: Response) => {
  try {
    const roleId: string = req.params.roleId
    const roleName: string = req.body.roleName

    const role: Role | null = await prisma.role.update({
      where: {
        id: roleId,
      },
      data: {
        name: roleName,
      },
    })
    res.status(200).json({
      id: role?.id,
      name: role?.name,
    })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const roleName: string = req.params.roleName
    const role: Role | null = await prisma.role.delete({
      where: {
        name: roleName,
      },
    })
    if (!role) res.sendStatus(404).json({ error: 'Role not found' })
    res.status(200).json({
      message: `Role with name - " ${roleName} " - deleted successfully`,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
