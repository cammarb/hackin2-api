import { Request, Response } from 'express'
import prisma from '../config/db'
import { User } from '@prisma/client'
import hashToken from '../config/hash'

export const newUser = async (req: Request, res: Response) => {
  const { username, email, firstName, lastName, password, roleId } = req.body
  if (!username || !password)
    return res
      .status(400)
      .json({ messaege: 'Username and password are required' })
  // Find if the username or email already exists
  const user: User[] | null = await prisma.user.findMany({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  })
  if (user.length > 0) return res.sendStatus(409) // Conflict
  try {
    const hashedPassword = await hashToken(password)
    const user: User = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: hashedPassword,
        roleId: roleId,
      },
    })
    res.status(201).json({ success: 'User created successfully' })
  } catch (err: Error | any) {
    res.status(500).json({ message: err?.message })
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: User[] = await prisma.user.findMany()
    res.status(200).json({
      users,
    })
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
      roleId: user?.roleId,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editUser = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id)
    const { username, email, firstName, lastName, role } = req.body

    const user: User | null = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        roleId: role,
      },
    })
    res.status(200).json({
      username: user?.username,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      roleId: user?.roleId,
    })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Get All Users' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
