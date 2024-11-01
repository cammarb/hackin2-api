import { generate } from 'generate-password'

export const generateRandomPassword = async () => {
  const password = generate({
    length: 16,
    numbers: true,
    uppercase: true,
    lowercase: true,
    symbols: true
  })

  return password
}
