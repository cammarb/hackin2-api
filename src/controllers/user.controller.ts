import { Request, Response } from 'express'
import prisma from '../utilts/client'
import { User, Role } from '@prisma/client'
import * as EmailValidator from 'email-validator'

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
    const role: Role = req.params.role as Role

    const user: User | null = await prisma.user.findUnique({
      where: {
        username: username,
        role: role,
      },
    })
    if (!user) res.status(404).json({ error: 'User not found' })
    res.status(200).json({
      id: user?.id,
      username: user?.username,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: user?.role,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editUser = async (req: Request, res: Response) => {
  try {
    const username: string = req.params.username
    // const role: Role = req.params.role as Role

    const { email, firstName, lastName, role } = req.body

    if (!EmailValidator.validate(email))
      return res.status(400).json({ messaege: 'Enter a valid email' })
    else {
      const user: User | null = await prisma.user.update({
        where: {
          username: username,
          role: role,
        },
        data: {
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
      })
      res.status(200).json({
        username: user?.username,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
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

export const getProfile = async (req: Request, res: Response) => {
  try {
    // const username: string = req.params.username
    // const role: Role = req.params.role as Role

    // const profile = await prisma.user.findUnique({
    //   where: {
    //     username: username,
    //     role: role,
    //   },
    //   select: {
    //     userProfile: true,
    //   },
    // })
    // if (!profile) res.status(404).json({ error: 'User not found' })
    // const profile: UserProfile | null = await prisma.userProfile.findUnique({
    //   where: {
    //     id: profileId,
    //   },
    // })
    // if (!profile) res.status(404).json({ error: 'Profile not found' })

    res.status(200).json({
      profile: ' profile?.userProfile',
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editProfile = async (req: Request, res: Response) => {
  try {
    // const { yearsOfExperience, qualifications, skills } = req.body

    // const username: string = req.params.username
    // const role: Role = req.params.role as Role

    // const profile = await prisma.user.findUnique({
    //   where: {
    //     username: username,
    //     role: role,
    //   },
    //   select: {
    //     userProfile: true,
    //   },
    // })
    // if (!profile) res.status(404).json({ error: 'User not found' })

    // const userProfile: UserProfile | null = await prisma.userProfile.update({
    //   where: {
    //     id: profile?.userProfile?.id,
    //   },
    //   data: {
    //     yearsOfExperience: yearsOfExperience,
    //     qualifications: qualifications,
    //     skills: skills,
    //   },
    // })
    // res.status(200).json({
    //   id: userProfile.id,
    //   yearsOfExperience: yearsOfExperience,
    //   qualifications: qualifications,
    //   skills: skills,
    // })

    res.status(200).json({
      profile: 'profile',
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
