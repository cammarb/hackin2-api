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

// TODO: Add query type for application
export const getApplications = async (query) => {
  const programId = query.program
  const userId = query.user

  let applications

  if (programId) {
    applications = await prisma.application.findMany({
      where: {
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
  }
  if (userId) {
    applications = await prisma.application.findMany({
      where: {
        userId: userId
      },
      include: {
        Program: {
          select: {
            name: true
          }
        }
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