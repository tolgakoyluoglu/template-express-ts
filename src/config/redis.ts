import { promisify } from 'util'
const redis = require('redis')

const REDIS_PORT: any = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6372
const REDIS_HOST: string | undefined = process.env.REDIS_HOST
const REDIS_USER: string | undefined = process.env.REDIS_USER

const clientOptions = {
  host: REDIS_HOST,
  user: REDIS_USER,
  port: REDIS_PORT,
}

const client = redis.createClient(clientOptions)
client.on('connect', () => {
  console.log('Connected to Redis.')
})
const set = promisify(client.set).bind(client)
const get = promisify(client.get).bind(client)
const del = promisify(client.del).bind(client)

export = {
  set,
  get,
  del,
}
