import prisma from '../../utilts/client'

describe('Prisma Client', () => {
  it('should create and export the Prisma client instance', () => {
    expect(prisma).toBeDefined()
  })
})
