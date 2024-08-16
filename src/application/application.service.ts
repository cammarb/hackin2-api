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

export const getApplications = async () => {
  const applications = await prisma.application.findMany({
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
  status: ApplicationStatus
) => {
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
