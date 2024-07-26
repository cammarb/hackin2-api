import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'

let container: StartedPostgreSqlContainer

const startDatabaseContainer = async () => {
  container = await new PostgreSqlContainer().withExposedPorts(5432).start()

  process.env.DATABASE_URL = `postgresql://${container.getUsername()}:${container.getPassword()}@localhost:${container.getMappedPort(5432)}/${container.getDatabase()}`

  console.log(`Database URL: ${process.env.DATABASE_URL}`)
}

const stopDatabaseContainer = async () => {
  if (container) {
    await container.stop()
  }
}

beforeAll(async () => {
  await startDatabaseContainer()
})

afterAll(async () => {
  await stopDatabaseContainer()
})

export { startDatabaseContainer }
