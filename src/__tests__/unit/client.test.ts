import prisma from '../../utils/client'

describe('Prisma Client', () => {
  it('should create and export the Prisma client instance', () => {
    expect(prisma).toBeDefined()
  })
})
