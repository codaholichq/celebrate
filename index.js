'use strict'
import http from 'http'
import { dirname } from 'path'
import express from 'express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import consola from 'consola'

import { emailTask } from './services/index.js'
import { db } from './data/db.js'
import { routes } from './routes/index.js'

const app = express()
const ENV = process.env

const { success, error } = consola
const mainPath = new URL(import.meta.url)
const dirName = dirname(mainPath.pathname)
const METHODS = 'GET, POST, PUT, DELETE, OPTIONS'
const HEADERS = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'

app.use((req, res, next) => {
  const origin = `${req.protocol}://${req.headers.host}`
  console.log(`Request Origin: ${origin}`)
  res.header('Access-Control-Allow-Origin', ENV.ORIGIN)
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', METHODS)
  res.header('Access-Control-Allow-Headers', HEADERS)
  next()
})

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/', routes)

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(dirName + '/public/'))
  app.get(/.*/, (req, res) => {
    res.sendFile(dirName + '/public/index.html')
  })
}

app.use(logger('dev'))

http.createServer(app)
  .listen(ENV.PORT, () => {
    emailTask()
    success({
      message: `App running on Local -> ${ENV.PORT}`,
      badge: true
    })
    return db
  })
