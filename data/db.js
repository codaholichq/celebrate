'use strict'
// import 'dotenv/config'
import db from 'mongoose'
import consola from 'consola'

const { success, error } = consola

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}

db.connect(process.env.MONGO_URL, options)
  .then(() => success({
    message: 'App connected to DB',
    badge: true
  })
  ).catch(err => error({
    message: err,
    badge: true
  }))

export { db }
