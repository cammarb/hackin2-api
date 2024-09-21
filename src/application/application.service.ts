import type { ApplicationStatus } from '@prisma/client'
import prisma from '../utils/client'
import type { ApplicationQuery } from './application.dto'

export const addApplication = async (userId: string, bountyId: string) => {
  // const rowCount = await prisma.application.count()

  const application = await prisma.application.create({
    data: {
      userId,
      bountyId
    }
  })
  return application
}

// TODO: Add query type for application
export const getApplications = async (query: ApplicationQuery) => {
  const programId = query.program
  const bountyId = query.bounty
  const userId = query.user

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let applications: any

  if (!bountyId && !userId && programId) {
    applications = await prisma.application.findMany({
      where: {
        Bounty: {
          programId: programId
        }
      },
      include: {
        User: {
          select: {
            id: true,
            username: true
          }
        },
        Bounty: {
          select: {
            title: true,
            programId: true
          }
        }
      }
    })
  }

  if (bountyId) {
    applications = await prisma.application.findMany({
      where: {
        bountyId: bountyId
      },
      include: {
        User: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })
  }
  if (userId) {
    applications = await prisma.application.findMany({
      where: {
        userId: userId
      },
      include: {
        Bounty: {
          select: {
            title: true,
            programId: true
          }
        }
        // BountyAssignment: true
      }
    })
  }

  return applications
}

export const getApplicationById = async (id: string) => {
  const application = await prisma.application.findUnique({
    where: {
      id: id
    }
  })
  return application
}

export const updateApplicaton = async (
  id: string,
  status: ApplicationStatus,
  bountyId?: string,
  userId?: string
) => {
  if (status === 'ACCEPTED' && userId && bountyId) {
    const [updateApplication, assignBounty] = await Promise.all([
      await prisma.application.update({
        where: { id: id },
        data: { status: status }
      }),
      await prisma.bountyAssignment.create({
        data: {
          bountyId: bountyId,
          userId: userId
        }
      })
    ])
    return { updateApplication, assignBounty }
  }

  const application = await prisma.application.update({
    where: {
      id: id
    },
    data: {
      status: status
    }
  })
  return application
}
