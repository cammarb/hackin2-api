import { User } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../config/db'

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, firstName, lastName, password, role } = req.body
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
  if (user) return res.sendStatus(409) // Conflict
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: hashedPassword,
        roleId: role,
      },
    })
  } catch (err: Error | any) {
    res.status(500).json({ message: err?.message })
  }
}
