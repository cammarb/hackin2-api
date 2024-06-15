import RedisStore from 'connect-redis'
import session from 'express-session'
import { createClient } from 'redis'

export const redisClient = createClient()
redisClient.on('connect', () => {
  console.log('Redis client connected')
})

redisClient.on('ready', () => {
  console.log('Redis client ready')
})

redisClient.on('end', () => {
  console.log('Redis client disconnected')
})

redisClient.connect().catch(console.error)

export const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'hackin2-api',
})

export const redisSession = session({
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  secret: 'redis-secret',
  cookie: {
    secure: true,
  },
})
