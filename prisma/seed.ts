import { PrismaClient } from '@prisma/client'
import hashToken from '../src/config/hash'

const prisma = new PrismaClient()

async function main() {
  const password = 'Welcome2Hackin2!' // Default password. On first login we can change the password  
  let hashedPassword = await hashToken(password)

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

  const company = await prisma.company.upsert({
    where: { companyName: 'Hackin2'},
    update: {},
    create: {
      companyName: 'Hackin2',
      companyURL: 'https://hackin2.com',
      companyLogo: 'Hackin2',
      companyDescription: 'Hackin2 - The pioneering bug bounty program for physical penetration testing'
    }
  })

  const skills = [
    'Lockpicking',
    'Social Engineering',
    'Surveillance',
    'Access Control Systems',
    'Intrusion Techniques',
    'Tactical Skills',
    'Wireless Exploitation',
    'Alarm Systems',
    'Device Manipulation',
    'Evasion',
    'Risk Assessment',
    'Documentation',
    'Ethical/Legal Awareness',
    'Adaptability',
    'Communication',
    'Physical Fitness',
    'Team Collaboration',
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: {
        name: skill,
      },
      update: {},
      create: {
        name: skill,
      },
    })
  }
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
