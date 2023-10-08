import bcrypt from 'bcrypt'

const hashToken = (token: string) => {
  const saltRounds = 10
  const password = token
  return bcrypt.hash(password, saltRounds)
}

export default hashToken
