import { getEnvs } from '../../utils/envs'

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}))

describe('getEnvs', () => {
  beforeEach(() => {
    process.env.PORT = '3000'
    process.env.PRIVKEY = '/path/to/private/key'
    process.env.PUBKEY = '/path/to/public/key'
    process.env.ISSUER = 'example.com'
    process.env.ORIGIN = 'http://example.com'
  })

  afterEach(() => {
    delete process.env.PORT
    delete process.env.PRIVKEY
    delete process.env.PUBKEY
    delete process.env.ISSUER
    delete process.env.ORIGIN
    jest.clearAllMocks()
  })

  test('getEnvs returns the correct environment variables', async () => {
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
    delete process.env.PORT
    delete process.env.PRIVKEY

    await expect(getEnvs()).rejects.toThrow('Missing env variables')
  })
})
