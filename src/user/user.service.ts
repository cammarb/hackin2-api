import type { Role, User } from '@prisma/client'
import prisma from '../utils/client'
import type {
  NewUserBody,
  UpdateUser,
  UpdateUserPassword,
  UserQueryParams
} from './user.dto'
import { validate } from 'email-validator'
import { compare } from 'bcrypt'
import { AuthenticationError } from '../error/apiError'
import hashToken from '../utils/hash'

export const getUsers = async (queryParams: UserQueryParams) => {
  if (!queryParams) {
    const users = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true
      }
    })
    return users
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

  const users = await prisma.user.findMany({
    where: {
      role: role
    },
    select: {
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true
    }
  })

  return users
}

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true
    }
  })
  return user
}

export const editUser = async (id: string, body: UpdateUser) => {
  const { username, email, firstName, lastName } = body

  if (email && !validate(email)) throw new Error('Email not valid')

  const user = await prisma.user.update({
    where: {
      id: id
    },
    data: {
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName
    }
  })

  return user
}

export const editUserPassword = async (
  id: string,
  body: UpdateUserPassword
) => {
  const { currentPassword, newPassword } = body

  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })

  if (!user) throw new AuthenticationError()

  const isValidPassword = await compare(currentPassword, user.password)
  if (!isValidPassword) throw new AuthenticationError()

  const password = await hashToken(newPassword)

  const updateUser = await prisma.user.update({
    where: {
      id: id
    },
    data: {
      password: password
    }
  })

  return updateUser
}

export const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: {
      id: id
    }
  })

  return user
}

export const createUser = async (body: NewUserBody) => {
  const { username, email, firstName, lastName, password, role } = body

  const user: User = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password,
      role: role
    }
  })
  return user
}
