import RedisStore from 'connect-redis'
import { randomUUID } from 'crypto'
import session, { Session } from 'express-session'
import { createClient } from 'redis'

const redisClient = createClient()
// redisClient.on('error', (err) => console.log('Redis Client Error', err))
// redisClient.on('ready', () => {
//   console.log('Redis Client Connected')
// })

const connectRedis = async () => {
  try {
    await redisClient.connect()
  } catch (error) {
    console.error(error)
    throw error
  }
}

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'hackin2-api:',
})

const redisSession = session({
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  secret: 'redis-secret',
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
  genid: () => randomUUID(),
})

export { redisClient, connectRedis, redisStore, redisSession }
