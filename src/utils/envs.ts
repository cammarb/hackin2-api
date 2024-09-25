import { promises } from 'node:fs'

export const getEnvs = async () => {
  try {
    const port = process.env.PORT
    const publicKeyPath = process.env.PUB_KEY_PATH
    const privateKeyPath = process.env.PPRI_KEY_PATH
    const issuer = process.env.ISSUER
    const origin = process.env.ORIGIN
    const otpService = process.env.OTP_SERVICE
    const otpUser = process.env.OTP_USER
    const otpPass = process.env.OTP_PASS
    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME
    const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY
    const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (
      !privateKeyPath ||
      !publicKeyPath ||
      !issuer ||
      !origin ||
      !port ||
      !otpService ||
      !otpUser ||
      !otpPass ||
      !cloudinaryCloudName ||
      !cloudinaryApiKey ||
      !cloudinaryApiSecret ||
      !stripeSecretKey
    ) {
      throw new Error('Missing env variables')
    }

    const [privateKey, publicKey] = await Promise.all([
      promises.readFile(privateKeyPath, { encoding: 'utf-8' }),
      promises.readFile(publicKeyPath, { encoding: 'utf-8' })
    ])
    return {
      port,
      privateKey,
      publicKey,
      issuer,
      origin,
      otpService,
      otpUser,
      otpPass,
      cloudinaryCloudName,
      cloudinaryApiKey,
      cloudinaryApiSecret,
      stripeSecretKey
    }
  } catch (error) {
    console.error('Failed to load environment variables', error)
    process.exit(1)
  }
}
