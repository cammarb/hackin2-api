import {
  ApplicationStatus,
  BountyStatus,
  CompanyRole,
  ProgramStatus,
  Role,
  Severity
} from '@prisma/client'
import prisma from '../../utils/client'
import hashToken from '../../utils/hash'

export const generateTestcontainerData = async () => {
  const password = 'testpassword'
  const hashedPassword = await hashToken(password)

  const adminUser = await prisma.user.upsert({
    where: { username: 'john.doe' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john.doe',
      email: 'john.doe@email.com',
      password: hashedPassword,
      role: Role.ENTERPRISE,
      stripeAccountId: 'john.doeStripeAccountId'
    }
  })

  const company = await prisma.company.upsert({
    where: { name: 'TestCompany' },
    update: {},
    create: {
      name: 'TestCompany',
      website: 'testcompany.com',
      stripeAccountId: 'companyStripeAccountId',
      email: 'companyEmail',
      CompanyMember: {
        create: {
          userId: adminUser.id,
          companyRole: CompanyRole.OWNER
        }
      },
      Program: {
        create: [
          {
            name: 'Program A',
            description: 'This is the description for Program A',
            location: 'Berlin',
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
          },
          {
            name: 'Program B',
            description: 'This is the description for Program B',
            location: 'Berlin',
            programStatus: ProgramStatus.ACTIVE,
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
        ]
      }
    }
  })

  const pentesterUser = await prisma.user.upsert({
    where: { username: 'jane.doe' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'jane.doe',
      email: 'jane.doe@email.com',
      password: hashedPassword,
      role: Role.PENTESTER,
      stripeAccountId: 'jane.doeStripeAccountId'
    }
  })

  const program = await prisma.program.findFirst({
    include: {
      SeverityReward: {
        select: {
          id: true
        }
      }
    }
  })

  if (program && program.SeverityReward.length > 0) {
    const bounty = await prisma.bounty.upsert({
      where: {
        title_programId: {
          title: 'Retrieve folder',
          programId: program.id
        }
      },
      update: {},
      create: {
        title: 'Retrieve folder',
        description: 'Retrieve folder in second floor room.',
        notes:
          'Take into consideration that taking pictures of individuals is not permitted.',
        programId: program?.id,
        status: BountyStatus.IN_PROGRESS,
        severityRewardId: program?.SeverityReward[0].id
      }
    })

    const bountyApplication = await prisma.application.upsert({
      where: {
        bountyId_userId: {
          bountyId: bounty.id,
          userId: pentesterUser.id
        }
      },
      update: {},
      create: {
        userId: pentesterUser.id,
        bountyId: bounty.id,
        status: ApplicationStatus.ACCEPTED
      }
    })

    const bountyAssignment = await prisma.bountyAssignment.upsert({
      where: {
        bountyId_userId: { bountyId: bounty.id, userId: pentesterUser.id }
      },
      update: {},
      create: {
        userId: pentesterUser.id,
        bountyId: bounty.id,
        applicationId: bountyApplication.id
      }
    })
  }
}
