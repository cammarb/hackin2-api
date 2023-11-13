import { Request, Response } from 'express'
import prisma from '../config/db'
import { User } from '@prisma/client'
import hashToken from '../config/hash'
import * as EmailValidator from 'email-validator'

export const newUser = async (req: Request, res: Response) => {
  const { username, email, firstName, lastName, password, roleId } = req.body
  if (!username || !password || !email || !firstName || !lastName || !roleId)
    return res.status(400).json({ messaege: 'All the fields are required' })
  // validate email
  if (!EmailValidator.validate(email))
    return res.status(400).json({ messaege: 'Enter a valid email' })
  // Find if the username or email already exists
  const user: User[] | null = await prisma.user.findMany({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  })
  if (user.length > 0) return res.sendStatus(409) // Conflict - if there are more users with that username or email, throw an error
  try {
    const hashedPassword = await hashToken(password)
    const user: User = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: hashedPassword,
        roleId: parseInt(roleId),
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
    const username: string = req.params.username
    const roleId: string = req.params.roleId

    const user: User | null = await prisma.user.findUnique({
      where: {
        username: username,
        roleId: parseInt(roleId),
      },
    })
    if (!user) res.status(404).json({ error: 'User not found' })
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
    const username: string = req.params.username
    const roleId: string = req.params.roleId
    const { email, firstName, lastName, role } = req.body

    if (!EmailValidator.validate(email))
      return res.status(400).json({ messaege: 'Enter a valid email' })
    else {
      const user: User | null = await prisma.user.update({
        where: {
          username: username,
          roleId: parseInt(roleId),
        },
        data: {
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
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const username: string = req.params.username
    const user: User | null = await prisma.user.delete({
      where: {
        username: username,
      },
    })
    if (!user) res.sendStatus(404).json({ error: 'User not found' })
    res
      .status(200)
      .json({ message: `User with ${username} deleted successfully` })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
