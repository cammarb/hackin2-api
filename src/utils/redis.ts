import RedisStore from 'connect-redis'
import { randomUUID } from 'crypto'
import session, { Session } from 'express-session'
import { createClient } from 'redis'

const redisClient = createClient()
redisClient.on('error', (err) => console.error('Redis Client Error', err))

const connectRedis = async () => {
  if (!redisClient.isOpen) redisClient.connect()
}

const disconnectRedis = async () => {
  if (redisClient.isOpen) redisClient.disconnect()
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

export { redisClient, redisStore, redisSession, connectRedis, disconnectRedis }
