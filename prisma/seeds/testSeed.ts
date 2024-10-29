import {
  CompanyRole,
  PrismaClient,
  ProgramStatus,
  Role,
  Severity,
  User
} from '@prisma/client'
import hashToken from '../../src/utils/hash'

const prisma = new PrismaClient()

async function main() {
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
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
