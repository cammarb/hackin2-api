import bcrypt from 'bcrypt'
import hashToken from '../../src/config/hash'

jest.mock('bcrypt')

describe('hashToken', () => {
  test('should hash a token', async () => {
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-token')

    const tokenToHash = 'your-secret-token'

    const hashedToken = await hashToken(tokenToHash)

    expect(bcrypt.hash).toHaveBeenCalledWith(tokenToHash, 10)

    expect(hashedToken).toBe('hashed-token')
  })

  test('Should handle hashing errors', async () => {
    ;(bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing error'))

    const tokenToHash = 'your-secret-token'

    await expect(hashToken(tokenToHash)).rejects.toThrow('Hashing error')

    expect(bcrypt.hash).toHaveBeenCalledWith(tokenToHash, 10)
  })
})
