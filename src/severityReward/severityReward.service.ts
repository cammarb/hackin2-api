import { Severity, SeverityReward } from '@prisma/client'
import prisma from '../utils/client'
import {
  SeverityRewardBody,
  SeverityRewardQueryParams,
} from './severityReward.dto'

export const getSeverityRewards = async (
  queryParams: SeverityRewardQueryParams,
) => {
  const allowedParams = ['program', 'severity']
  for (const param in queryParams) {
    if (!allowedParams.includes(param)) {
      throw new Error('Invalid query parameter')
    }
  }

  let programId: string | undefined
  let severity: Severity | undefined

  if (queryParams.severity) {
    const parsedSeverity = queryParams.severity
      .toString()
      .toUpperCase() as Severity
    if (!Object.values(Severity).includes(parsedSeverity)) {
      throw new Error('Invalid status value')
    }
    severity = parsedSeverity
  }

  if (queryParams.program) {
    programId = queryParams.program
  }

  const severityRewards = await prisma.severityReward.findMany({
    where: {
      programId: programId,
      severity: severity as Severity,
    },
  })

  return severityRewards
}

export const getSeverityRewardById = async (id: string) => {
  const severityReward: SeverityReward | null =
    await prisma.severityReward.findUnique({
      where: {
        id: id,
      },
    })

  return severityReward
}

export const addSeverityReward = async (body: SeverityRewardBody) => {
  const { severity, min, max, program } = body

  if (!severity || !min || !max || !program)
    throw new Error('Required fields missing')

  const severityReward = await prisma.severityReward.create({
    data: {
      severity: severity,
      min: min,
      max: max,
      programId: program,
    },
  })

  return severityReward
}

export const updateSeverityReward = async (
  id: string,
  min: number,
  max: number,
) => {
  const severityReward: SeverityReward | null =
    await prisma.severityReward.update({
      where: {
        id: id,
      },
      data: {
        min: min,
        max: max,
      },
    })

  return severityReward
}

export const deleteSeverityReward = async (id: string) => {
  const severityReward: SeverityReward | null =
    await prisma.severityReward.delete({
      where: {
        id: id,
      },
    })

  return severityReward
}
