import {
  type Bounty,
  BountyAssignment,
  BountyStatus,
  Severity,
  SeverityReward
} from '@prisma/client'
import prisma from '../utils/client'
import type {
  AddBountyBody,
  BountyQueryParams,
  BountyAssignmentsQuery,
  UpdateBountyBody
} from './bounty.dto'

export const getBounties = async (queryParams: BountyQueryParams) => {
  let bounties: Bounty[]

  if (!queryParams) bounties = await prisma.bounty.findMany()

  let severity: Severity | undefined
  let programId: string | undefined
  let status: BountyStatus | undefined

  if (queryParams.severity) {
    const severityParsed = queryParams.severity
      .toString()
      .toUpperCase() as Severity
    if (!Object.values(Severity).includes(severityParsed)) {
      throw new Error('Invalid severity value')
    }
    severity = severityParsed
  }

  if (queryParams.program) {
    programId = queryParams.program
  }

  if (queryParams.status) {
    const statusParsed = queryParams.status
      .toString()
      .toUpperCase() as BountyStatus
    if (!Object.values(BountyStatus).includes(statusParsed)) {
      throw new Error('Invalid status value')
    }
    status = statusParsed
  }

  bounties = await prisma.bounty.findMany({
    where: {
      SeverityReward: {
        severity: severity
      },
      programId: programId,
      status: status
    },
    include: {
      assignedUsers: true
    }
  })

  return bounties
}

export const getBountyById = async (id: string) => {
  const bounty = await prisma.bounty.findUnique({
    where: {
      id: id
    },
    include: {
      assignedUsers: true
    }
  })

  return bounty
}

export const editBounty = async (id: string, body: UpdateBountyBody) => {
  const { title, description, severityRewardId } = body
  const bounty = await prisma.bounty.update({
    where: {
      id: id
    },
    data: {
      title: title,
      description: description,
      severityRewardId: severityRewardId
    }
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
      programId: programId
    }
  })

  return bounty
}

export const deleteBounty = async (id: string) => {
  const bounty = await prisma.bounty.delete({
    where: {
      id: id
    }
  })

  return bounty
}

export const getBountyAssignments = async (query: BountyAssignmentsQuery) => {
  const { bounty, user } = query

  let bountyAssignment: object | null = null
  if (bounty) {
    bountyAssignment = await prisma.bountyAssignment.findMany({
      where: {
        bountyId: bounty
      }
    })
  }
  if (user) {
    bountyAssignment = await prisma.bountyAssignment.findMany({
      where: {
        userId: user
      }
    })
  }

  return bountyAssignment
}
