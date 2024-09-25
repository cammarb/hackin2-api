import type { PrismaClient } from '@prisma/client'
import {
  mockDeep,
  mockReset,
  type DeepMockProxy,
  mock
} from 'jest-mock-extended'
import prisma from '../../utils/client'

jest.mock('../../utils/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
