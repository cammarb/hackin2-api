/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/e2e/*.test.ts',
    '**/__tests__/unit/*.test.ts'
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/__mocks__/prismaMock.ts'],
  globalSetup: '<rootDir>/src/__tests__/jest-global-setup.ts',
  globalTeardown: '<rootDir>/src/__tests__/jest-global-teardown.ts'
}
