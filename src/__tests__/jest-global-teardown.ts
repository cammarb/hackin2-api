// jest-global-teardown.ts
import { stopAllContainers } from './testcontainers/testcontainers'

export default async () => {
  await stopAllContainers()
}
