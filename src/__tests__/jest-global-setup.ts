// jest-global-setup.ts

import { generateTestcontainerData } from './testcontainers/generateTestcontainerData'
import {
  startPostgresContainer,
  startRedisContainer
} from './testcontainers/testcontainers'

export default async () => {
  const postgresContainer = await startPostgresContainer()
  const redisContainer = await startRedisContainer()
  const generateData = await generateTestcontainerData()
}
