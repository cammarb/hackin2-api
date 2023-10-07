import bicrypt from 'bcrypt'

const hashToken = (token: string) => {
  const saltRounds = 10
  const password = token
  return bicrypt.hash(password, saltRounds)
}

export default hashToken
