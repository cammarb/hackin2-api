// import { RedisClientType } from 'redis'
// import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
// import { redisClient } from './src/utils/redis'

// jest.mock('./src/utils/redis', () => ({
//   __esModule: true,
//   default: mockDeep<RedisClientType>(),
// }))

// beforeEach(() => {
//   mockReset(redisMock)
// })

// export const redisMock =
//   redisClient as unknown as DeepMockProxy<RedisClientType>

jest.mock('redis', () => jest.requireActual('redis-mock'))
