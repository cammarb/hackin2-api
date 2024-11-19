// jest-global-setup.ts

import {
  startPostgresContainer,
  startRedisContainer
} from './testcontainers/testcontainers'

export default async () => {
  const postgresContainer = await startPostgresContainer()
  const redisContainer = await startRedisContainer()
}
