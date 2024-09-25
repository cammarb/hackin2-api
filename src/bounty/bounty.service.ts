import {
  type Bounty,
  BountyAssignment,
  BountyStatus,
  type Severity,
  SeverityReward
} from '@prisma/client'
import prisma from '../utils/client'
import type {
  AddBountyBody,
  BountyQueryParams,
  BountyAssignmentsQuery,
  UpdateBountyBody
} from './bounty.dto'
import type { SessionData } from 'express-session'

export const getBounties = async (
  queryParams: BountyQueryParams,
  user: SessionData['user']
) => {
  const { severity, program, status } = queryParams
  let statusParsed: BountyStatus | undefined

  if (status) {
    statusParsed = status.toString().toUpperCase() as BountyStatus
    if (!Object.values(BountyStatus).includes(statusParsed)) {
      throw new Error('Invalid status value')
    }
  }

  const bounties = await prisma.bounty.findMany({
    where: {
      ...(severity && {
        SeverityReward: {
          severity: severity as Severity
        }
      }),
      ...(program && { programId: program }),
      ...(statusParsed && { status: statusParsed })
    },
    include: user.role === 'ENTERPRISE' ? { assignedUsers: true } : undefined
  })

  return bounties
}

export const getBountyById = async (id: string, user: SessionData['user']) => {
  const bounty = await prisma.bounty.findUnique({
    where: {
      id: id
    },
    include: user.role === 'ENTERPRISE' ? { assignedUsers: true } : undefined
  })

  return bounty
}

export const editBounty = async (id: string, body: UpdateBountyBody) => {
  const { title, description, severityRewardId, status } = body
  const bounty = await prisma.bounty.update({
    where: {
      id: id
    },
    data: {
      title: title,
      status: status,
      description: description,
      severityRewardId: severityRewardId
    }
  })

  return bounty
}

export const addBounty = async (body: AddBountyBody) => {
  const { title, description, severityRewardId, programId, notes } = body
  const bounty = await prisma.bounty.create({
    data: {
      title: title,
      description: description,
      severityRewardId: severityRewardId,
      programId: programId,
      notes: notes
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

  const bountyAssignment = await prisma.bountyAssignment.findMany({
    where: bounty ? { bountyId: bounty } : { userId: user },
    include: {
      Submission: true,
      User: bounty
        ? {
            select: {
              username: true
            }
          }
        : false,
      Bounty: user
        ? {
            select: {
              title: true
            }
          }
        : false
    }
  })

  return bountyAssignment
}

export const getBountyAssignmentById = async (
  bountyId: string,
  userId: string
) => {
  const bountyAssignment = await prisma.bountyAssignment.findUnique({
    where: {
      bountyId_userId: {
        bountyId: bountyId,
        userId: userId
      }
    },
    include: {
      Submission: true
    }
  })

  return bountyAssignment
}
