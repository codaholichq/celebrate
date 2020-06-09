'use strict'
import http from 'http'
import { dirname } from 'path'
import express from 'express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import consola from 'consola'

import { CONFIG } from './config/index.js'
import { emailTask } from './services/index.js'
import { db } from './data/db.js'
import { routes } from './routes/index.js'

const app = express()

const { success, error } = consola
const mainPath = new URL(import.meta.url)
const dirName = dirname(mainPath.pathname)
const METHODS = 'GET, POST, PUT, DELETE, OPTIONS'
const HEADERS = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CONFIG.ORIGIN)
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', METHODS)
  res.header('Access-Control-Allow-Headers', HEADERS)
  next()
})

app.use(compression())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/', routes)

if (CONFIG.ENV === 'production') {
  app.use(express.static(dirName + '/public/'))
  app.get(/.*/, (req, res) => {
    res.sendFile(dirName + '/public/index.html')
  })
}

app.use(logger('tiny'))



http.createServer(app)
  .listen(CONFIG.PORT, () => {
    emailTask()
    success({
      message: `App running on Local -> ${CONFIG.PORT}`,
      badge: true
    })
    return db
  })
