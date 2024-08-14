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
  // Default password. On first login we can change the password
  const password = 'Welcome2Hackin2!'
  const hashedPassword = await hashToken(password)

  const adminUser = await prisma.user.upsert({
    where: { username: 'user.admin' },
    update: {},
    create: {
      firstName: 'User',
      lastName: 'Admin',
      username: 'user.admin',
      email: 'user.admin@code.berlin',
      password: hashedPassword,
      role: Role.ENTERPRISE
    }
  })

  const memberUser = await prisma.user.upsert({
    where: { username: 'user.member' },
    update: {},
    create: {
      firstName: 'User',
      lastName: 'Member',
      username: 'user.member',
      email: 'user.member@code.berlin',
      password: hashedPassword,
      role: Role.ENTERPRISE
    }
  })

  const company = await prisma.company.upsert({
    where: { name: 'Hackin2' },
    update: {},
    create: {
      name: 'Hackin2',
      website: 'hackin2.com',
      CompanyMember: {
        create: [
          {
            userId: adminUser.id,
            companyRole: CompanyRole.OWNER
          },
          {
            userId: memberUser.id,
            companyRole: CompanyRole.MEMBER
          }
        ]
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
    where: { username: 'user.pentester' },
    update: {},
    create: {
      firstName: 'User',
      lastName: 'Pentester',
      username: 'user.pentester',
      email: 'user.pentester@code.berlin',
      password: hashedPassword,
      role: Role.PENTESTER
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
