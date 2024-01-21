import { Request, Response, NextFunction } from 'express'
import { User } from '@prisma/client'
import prisma from '../config/db'

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username
    const role = req.params.role

    if (!username) {
      return res.status(400).json({ error: 'payload not provided' })
    }

    const user = await prisma.user.findUnique({
      where: { username: username },
      select: { role: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userRole = user.role

    if (role === userRole && userRole === 'ADMIN') {
      return next()
    } else {
      return res.status(403).json({ error: 'Permission denied' })
    }
  } catch (error) {
    console.error('Error in checkAdmin middleware:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export { checkAdmin }
