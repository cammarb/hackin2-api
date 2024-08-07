import { type Program, ProgramStatus, Severity } from '@prisma/client'
import prisma from '../utils/client'
import type {
  NewProgramBody,
  ProgramQueryParams,
  UpdateProgramBody
} from './program.dto'

export const getPrograms = async (queryParams: ProgramQueryParams) => {
  let programs: Program[]

  if (!queryParams) {
    programs = await prisma.program.findMany()
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
      programStatus: programStatus
    }
  })

  return programs
}

export const getProgramById = async (id: string) => {
  const program = await prisma.program.findUnique({
    where: {
      id: id
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
          website: true
        }
      },
      SeverityReward: {
        select: {
          min: true,
          max: true,
          severity: true
        }
      }
    }
  })

  return program
}

export const editProgram = async (
  id: string,
  body: UpdateProgramBody
): Promise<Program | null> => {
  const { name, description, programStatus, location } = body

  const updatedProgram = prisma.program.update({
    where: {
      id: id
    },
    data: {
      name: name,
      description: description,
      programStatus: programStatus,
      location: location
    }
  })

  return updatedProgram
}

export const addProgram = async (companyId: string, body: NewProgramBody) => {
  const { name, description, location } = body

  const program = await prisma.program.create({
    data: {
      name: name,
      companyId: companyId,
      description: description,
      location: location,
      SeverityReward: {
        create: [
          {
            severity: Severity.LOW,
            min: 50,
            max: 200
          },
          {
            severity: Severity.MEDIUM,
            min: 250,
            max: 1000
          },
          {
            severity: Severity.HIGH,
            min: 1500,
            max: 4000
          },
          {
            severity: Severity.CRITICAL,
            min: 5000,
            max: 10000
          }
        ]
      }
    }
  })

  return program
}

export const deleteProgram = async (id: string) => {
  const program = await prisma.program.delete({
    where: {
      id: id
    }
  })
  return program
}
