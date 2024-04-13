import fs from 'fs'
import jwt from 'jsonwebtoken'

const getEnvs = async () => {
  try {
    const port = process.env.PORT
    const privateKeyPath: jwt.Secret | undefined = process.env.PRIVKEY
    const publicKeyPath: jwt.Secret | undefined = process.env.PUBKEY
    const issuer = process.env.ISSUER
    const origin = process.env.ORIGIN

    if (!privateKeyPath || !publicKeyPath || !issuer || !origin || !port) {
      throw new Error('Missing env variables')
    }

    const privateKey = await fs.promises.readFile(privateKeyPath, {
      encoding: 'utf-8',
    })
    const publicKey = await fs.promises.readFile(publicKeyPath, {
      encoding: 'utf-8',
    })
    return { port, privateKey, publicKey, issuer, origin }
  } catch (error) {
    throw error
  }
}

export default getEnvs
