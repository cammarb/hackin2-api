import type { ApplicationStatus } from '@prisma/client'
import prisma from '../utils/client'

export const addApplication = async (userId: string, programId: string) => {
  const application = await prisma.application.create({
    data: {
      userId,
      programId
    }
  })
  return application
}

export const getApplications = async (query) => {
  const programId = query.program
  const userId = query.user

  const applications = await prisma.application.findMany({
    where: {
      userId: userId,
      programId: programId
    },
    include: {
      Program: {
        select: {
          name: true
        }
      }
    }
  })
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
  bountyId: string,
  userId?: string
) => {
  if (status === 'ACCEPTED' && userId) {
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
