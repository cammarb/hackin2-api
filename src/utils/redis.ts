import RedisStore from 'connect-redis'
import { randomUUID } from 'node:crypto'
import session, { Session } from 'express-session'
import { createClient } from 'redis'

const host = process.env.CACHE_HOSTNAME || 'localhost'
const port = process.env.CACHE_PORT || '6379'
const password = process.env.CACHE_PASS || ''

const redisClient = createClient({
  url: `redis://${host}:${port}`,
  password: password
})

redisClient.on('error', (err) => console.log('Redis Client Error', err))

const connectRedis = async () => {
  if (!redisClient.isOpen) await redisClient.connect()
}

const disconnectRedis = async () => {
  if (redisClient.isOpen) await redisClient.disconnect()
}

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'hackin2-api:'
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
    maxAge: 24 * 60 * 60 * 1000
  },
  genid: () => randomUUID()
})

export { redisClient, redisStore, redisSession, connectRedis, disconnectRedis }
