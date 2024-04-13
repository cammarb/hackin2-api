import getEnvs from '../../utils/envs' // Assuming this is your module

// Mock fs.promises.readFile
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}))

describe('getEnvs', () => {
  beforeEach(() => {
    // Set up mock environment variables
    process.env.PORT = '3000' // Set your desired value
    process.env.PRIVKEY = '/path/to/private/key'
    process.env.PUBKEY = '/path/to/public/key'
    process.env.ISSUER = 'example.com'
    process.env.ORIGIN = 'http://example.com'
  })

  afterEach(() => {
    // Clean up mock environment variables
    delete process.env.PORT
    delete process.env.PRIVKEY
    delete process.env.PUBKEY
    delete process.env.ISSUER
    delete process.env.ORIGIN
    jest.clearAllMocks() // Clear mock functions after each test
  })

  test('getEnvs returns the correct environment variables', async () => {
    // Mock fs.promises.readFile to return some dummy content
    const fs = require('fs')
    fs.promises.readFile.mockResolvedValue('dummy content')

    const result = await getEnvs()

    expect(result).toEqual({
      port: '3000',
      privateKey: 'dummy content',
      publicKey: 'dummy content',
      issuer: 'example.com',
      origin: 'http://example.com',
    })
  })

  test('getEnvs throws an error if any environment variable is missing', async () => {
    // Remove some required environment variables
    delete process.env.PORT
    delete process.env.PRIVKEY

    await expect(getEnvs()).rejects.toThrow('Missing env variables')
  })
})
