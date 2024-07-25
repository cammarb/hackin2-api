import { Program, ProgramStatus } from '@prisma/client'
import prisma from '../utils/client'
import { ProgramQueryParams, UpdateProgram } from './program.dto'

export const getPrograms = async (queryParams: ProgramQueryParams) => {
  let programs: Program[]

  if (!queryParams) {
    programs = await prisma.program.findMany()
  }

  const allowedParams = ['status', 'company']
  for (const param in queryParams) {
    if (!allowedParams.includes(param)) {
      throw new Error('Invalid query parameter')
    }
  }

  let programStatus: ProgramStatus | undefined
  let companyId: string | undefined

  if (queryParams.status) {
    const status = queryParams.status.toString().toUpperCase() as ProgramStatus
    if (!Object.values(ProgramStatus).includes(status)) {
      throw new Error('Invalid status value')
    }
    programStatus = status
  }

  if (queryParams.company) {
    companyId = queryParams.company
  }

  programs = await prisma.program.findMany({
    where: {
      companyId: companyId,
      programStatus: programStatus,
    },
  })

  return programs
}

export const getProgramById = async (id: string) => {
  const program = await prisma.program.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      programStatus: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      Company: {
        select: {
          id: true,
          name: true,
          website: true,
        },
      },
      SeverityReward: {
        select: {
          min: true,
          max: true,
          severity: true,
        },
      },
    },
  })

  return program
}

export const editProgram = async (
  id: string,
  body: UpdateProgram,
): Promise<Program | null> => {
  const { name, description, programStatus, location } = body

  const updatedProgram = prisma.program.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      description: description,
      programStatus: programStatus,
      location: location,
    },
  })

  return updatedProgram
}
