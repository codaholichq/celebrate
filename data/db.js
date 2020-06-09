'use strict'
// import 'dotenv/config'
import db from 'mongoose'
import consola from 'consola'
import { CONFIG } from '../config/index.js'

const { success, error } = consola

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  retryWrites: true,
  w: 'majority',
  autoIndex: true,
  keepAlive: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  useFindAndModify: false,
  useUnifiedTopology: true
}

db.connect(CONFIG.DB_URI, options)
  .then(() => success({
    message: 'App connected to DB',
    badge: true
  })
  ).catch(err => error({
    message: err,
    badge: true
  }))

export { db }
