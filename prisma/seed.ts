import { PrismaClient, Role, User } from '@prisma/client'
import hashToken from '../src/utilts/hash'

const prisma = new PrismaClient()

async function main() {
  // Default password. On first login we can change the password
  const password = 'Welcome2Hackin2!'
  let hashedPassword = await hashToken(password)

  const adminUser = await prisma.user.upsert({
    where: { username: 'camila.martinez' },
    update: {},
    create: {
      firstName: 'Camila',
      lastName: 'Martinez',
      username: 'camila.martinez',
      email: 'camila.martinez@code.berlin',
      password: hashedPassword,
      role: 'ENTERPRISE',
    },
  })

  const company = await prisma.company.upsert({
    where: { name: 'Hackin2' },
    update: {},
    create: {
      name: 'Hackin2',
      ownerId: adminUser.id,
      CompanyMember: {
        create: {
          userId: adminUser.id,
          companyRole: 'OWNER',
        },
      },
    },
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
