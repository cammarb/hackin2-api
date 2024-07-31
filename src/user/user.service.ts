import { Role } from '@prisma/client'
import prisma from '../utils/client'
import { UpdateUser, UserQueryParams } from './user.dto'
import { validate } from 'email-validator'

export const getUsers = async (queryParams: UserQueryParams) => {
  let users

  if (!queryParams) {
    users = users = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true,
      },
    })
  }

  const allowedParams = ['role']
  for (const param in queryParams) {
    if (!allowedParams.includes(param)) {
      throw new Error('Invalid query parameter')
    }
  }

  let role: Role | undefined
  if (queryParams.role) {
    role = queryParams.role as Role
  }

  users = await prisma.user.findMany({
    where: {
      role: role,
    },
    select: {
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
    },
  })

  return users
}

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
    },
  })
  return user
}

export const editUser = async (id: string, body: UpdateUser) => {
  const { username, email, firstName, lastName } = body

  if (email && !validate(email)) throw new Error('Email not valid')

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
    },
  })

  return user
}

export const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  })

  return user
}
