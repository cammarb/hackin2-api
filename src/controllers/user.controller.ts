import { Prisma, PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json({ message: 'Get All Users' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id)
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })
    res.status(200).json({
      id: user?.id,
      username: user?.username,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: user?.roleId,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Get All Users' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Get All Users' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}