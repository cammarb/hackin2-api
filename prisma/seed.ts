import { PrismaClient } from '@prisma/client'
import hashToken from '../src/config/hash'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrator. Manages everything',
    },
  })
  const manager = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: {
      name: 'Manager',
      description: 'Manage most aspects of the site',
    },
  })
  const enterprise = await prisma.role.upsert({
    where: { name: 'Enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      description: 'Enterprise owner',
    },
  })
  const user = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      description: 'Average aspiring Social Engineer',
    },
  })
  console.log({ admin, manager, enterprise, user })

  const password = 'Welcome2Hackin2!' // Default password. On first login we can change the password
  const hashedPassword = await hashToken(password)
  const adminUser1 = await prisma.user.upsert({
    where: { username: 'camila.martinez' },
    update: {},
    create: {
      firstName: 'Camila',
      lastName: 'Martinez',
      username: 'camila.martinez',
      email: 'camila.martinez@code.berlin',
      password: hashedPassword,
      roleId: admin.id,
    },
  })

  const adminUser2 = await prisma.user.upsert({
    where: { username: 'stefanie.keichel' },
    update: {},
    create: {
      firstName: 'Stefanie',
      lastName: 'Keichel',
      username: 'stefanie.keichel',
      email: 'stefanie.keichel@code.berlin',
      password: hashedPassword,
      roleId: admin.id,
    },
  })

  console.log({ adminUser1, adminUser2 })
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
