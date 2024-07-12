import { promises } from 'fs'

const getEnvs = async () => {
  try {
    const port = process.env.PORT
    const privateKeyPath = process.env.PRIVKEY
    const publicKeyPath = process.env.PUBKEY
    const issuer = process.env.ISSUER
    const origin = process.env.ORIGIN
    const otpService = process.env.OTP_SERVICE
    const otpUser = process.env.OTP_USER
    const otpPass = process.env.OTP_PASS

    if (
      !privateKeyPath ||
      !publicKeyPath ||
      !issuer ||
      !origin ||
      !port ||
      !otpService ||
      !otpUser ||
      !otpPass
    ) {
      throw new Error('Missing env variables')
    }

    const [privateKey, publicKey] = await Promise.all([
      promises.readFile(privateKeyPath, { encoding: 'utf-8' }),
      promises.readFile(publicKeyPath, { encoding: 'utf-8' }),
    ])
    return { port, privateKey, publicKey, issuer, origin }
  } catch (error) {
    throw error
  }
}

export { getEnvs }
