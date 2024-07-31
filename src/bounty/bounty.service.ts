import { Bounty, Severity, SeverityReward } from '@prisma/client'
import prisma from '../utils/client'
import {
  AddBountyBody,
  BountyQueryParams,
  UpdateBountyBody,
} from './bounty.dto'

export const getBounties = async (queryParams: BountyQueryParams) => {
  let bounties: Bounty[]

  if (!queryParams) bounties = await prisma.bounty.findMany()

  const allowedParams = ['program', 'severity']
  for (const param in queryParams) {
    if (!allowedParams.includes(param)) {
      throw new Error('Invalid query parameter')
    }
  }

  let severity: Severity | undefined
  let programId: string | undefined

  if (queryParams.severity) {
    const severityParsed = queryParams.severity
      .toString()
      .toUpperCase() as Severity
    if (!Object.values(Severity).includes(severityParsed)) {
      throw new Error('Invalid status value')
    }
    severity = severityParsed
  }

  if (queryParams.program) {
    programId = queryParams.program
  }

  bounties = await prisma.bounty.findMany({
    where: {
      SeverityReward: {
        severity: severity,
      },
      programId: programId,
    },
  })

  return bounties
}

export const getBountyById = async (id: string) => {
  const bounty = await prisma.bounty.findUnique({
    where: {
      id: id,
    },
  })

  return bounty
}

export const editBounty = async (id: string, body: UpdateBountyBody) => {
  const { title, description, severityRewardId } = body
  const bounty = await prisma.bounty.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      description: description,
      severityRewardId: severityRewardId,
    },
  })

  return bounty
}

export const addBounty = async (body: AddBountyBody) => {
  const { title, description, severityRewardId, programId } = body
  const bounty = await prisma.bounty.create({
    data: {
      title: title,
      description: description,
      severityRewardId: severityRewardId,
      programId: programId,
    },
  })

  return bounty
}

export const deleteBounty = async (id: string) => {
  const bounty = await prisma.bounty.delete({
    where: {
      id: id,
    },
  })

  return bounty
}
