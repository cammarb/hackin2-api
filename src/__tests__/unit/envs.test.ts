import { getEnvs } from '../../utils/envs'
import { promises } from 'fs'

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
    process.env.OTP_SERVICE = 'test email'
    process.env.OTP_USER = 'user@test.com'
    process.env.OTP_PASS = 'test password'
  })

  afterEach(() => {
    delete process.env.PORT
    delete process.env.PRIVKEY
    delete process.env.PUBKEY
    delete process.env.ISSUER
    delete process.env.ORIGIN
    delete process.env.OTP_SERVICE
    delete process.env.OTP_USER
    delete process.env.OTP_PASS
    jest.clearAllMocks()
  })

  test('getEnvs returns the correct environment variables', async () => {
    const readFileMock = promises.readFile as jest.Mock
    readFileMock.mockImplementation((path) => {
      if (path === process.env.PRIVKEY) {
        return Promise.resolve('dummy private key content')
      } else if (path === process.env.PUBKEY) {
        return Promise.resolve('dummy public key content')
      }
      return Promise.reject(new Error('File not found'))
    })

    const result = await getEnvs()

    expect(result).toEqual({
      port: '3000',
      privateKey: 'dummy private key content',
      publicKey: 'dummy public key content',
      issuer: 'example.com',
      origin: 'http://example.com',
      otpPass: 'test password',
      otpService: 'test email',
      otpUser: 'user@test.com',
    })
  })

  test('getEnvs throws an error if any environment variable is missing', async () => {
    delete process.env.PORT
    delete process.env.PRIVKEY

    await expect(getEnvs()).rejects.toThrow('Missing env variables')
  })
})
