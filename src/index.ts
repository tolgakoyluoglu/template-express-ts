import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import router from './api'
import './config/redis'
import './config/session'
import './config/typeorm'
import { logRequests } from './helpers/logger'
import * as middlewares from './middlewares'

const app = express()
const { NODE_ENV } = process.env

if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With, content-type'
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.setHeader('Access-Control-Allow-Credentials', true)

    next()
  })
}
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(logRequests())

app.use('/api', router)

// Needs to be loaded at end of file
app.use(middlewares.errorHandler)
app.use(middlewares.notFound)

if (process.env.PORT) {
  const PORT: number = parseInt(process.env.PORT, 10)
  const HOST: string = process.env.HOST ?? '0.0.0.0'
  app.listen(PORT, HOST, () => {
    console.log('\x1b[36m%s\x1b[0m', `API URL: http://${HOST}:${PORT}`)
    console.log('\x1b[36m%s\x1b[0m', `Docs URL: http://${HOST}:${PORT}/docs`)
  })
}
