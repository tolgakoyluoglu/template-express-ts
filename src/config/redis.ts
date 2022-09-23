import { promisify } from 'util'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const redis = require('redis')

const REDIS_PORT: any = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : 6372
const { REDIS_HOST } = process.env
const { REDIS_USER } = process.env

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

export default {
  set,
  get,
  del,
}
