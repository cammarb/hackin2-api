import RedisStore from 'connect-redis'
import session from 'express-session'
import { createClient } from 'redis'

export const redisClient = createClient()

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
