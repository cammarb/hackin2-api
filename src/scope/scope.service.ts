import prisma from '../utils/client'
import type { ScopeBody, ScopeQueryParams } from './scope.dto'

export const addScope = async (
  queryParams: ScopeQueryParams,
  body: ScopeBody
) => {
  const { name, description } = body
  let programId: string | undefined

  if (!queryParams.program) throw new Error('Missing query params')

  programId = queryParams.program

  const scope = await prisma.scope.create({
    data: {
      programId: programId,
      name: name,
      description: description
    }
  })

  return scope
}

export const updateScope = async (id: string, body: ScopeBody) => {
  const { name, description } = body

  const scope = await prisma.scope.update({
    where: {
      id: id
    },
    data: {
      name: name,
      description: description
    }
  })

  return scope
}

export const getScopes = async (queryParams: ScopeQueryParams) => {
  const programId = queryParams.program

  const scopes = await prisma.scope.findMany({
    where: {
      programId: programId
    }
  })

  return scopes
}

export const deleteScope = async (id: string) => {
  const scope = await prisma.scope.delete({
    where: {
      id: id
    }
  })

  return scope
}
