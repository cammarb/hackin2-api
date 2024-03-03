import prisma from '../../src/config/db'

describe('Prisma Client', () => {
  it('should create and export the Prisma client instance', () => {
    expect(prisma).toBeDefined()
  })
})
