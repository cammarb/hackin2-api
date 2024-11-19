import { GenericContainer, type StartedTestContainer } from 'testcontainers'

let postgresContainer: StartedTestContainer | null = null
let redisContainer: StartedTestContainer | null = null

export const startPostgresContainer = async () => {
  if (!postgresContainer) {
    const container = new GenericContainer('postgres')
      .withExposedPorts({ container: 5432, host: 5432 })
      .withEnvironment({
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: 'postgres',
        POSTGRES_DB: 'testdb'
      })
      .withCopyFilesToContainer([
        {
          source: './prisma/migrations/20241110174749_init/migration.sql',
          target: '/docker-entrypoint-initdb.d/migration.sql'
        }
      ])
      .withLogConsumer((stream) => {
        stream.on('data', (line) => console.log(line))
        stream.on('err', (line) => console.error(line))
        stream.on('end', () => console.log('Postgres stream closed'))
      })
      .withReuse()

    postgresContainer = await container.start()
  }

  return postgresContainer
}

export const startRedisContainer = async () => {
  if (!redisContainer) {
    const container = new GenericContainer('redis')
      .withExposedPorts({ container: 6379, host: 6379 })
      .withLogConsumer((stream) => {
        stream.on('data', (line) => console.log(line))
        stream.on('err', (line) => console.error(line))
        stream.on('end', () => console.log('Redis stream closed'))
      })
      .withReuse()

    redisContainer = await container.start()
  }

  return redisContainer
}

export const stopAllContainers = async () => {
  if (postgresContainer) await postgresContainer.stop()
  if (redisContainer) await redisContainer.stop()
}
