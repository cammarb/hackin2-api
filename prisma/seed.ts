import { PrismaClient } from '@prisma/client'
import hashToken from '../src/config/hash'

const prisma = new PrismaClient()

async function main() {
  const password = 'Welcome2Hackin2!' // Default password. On first login we can change the password
  const hashedPassword = await hashToken(password)

  console.log(hashedPassword)
  const adminUser1 = await prisma.user.upsert({
    where: { username: 'camila.martinez' },
    update: {},
    create: {
      firstName: 'Camila',
      lastName: 'Martinez',
      username: 'camila.martinez',
      email: 'camila.martinez@code.berlin',
      password: hashedPassword,
      role: 'ADMIN',
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
      role: 'ADMIN',
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
